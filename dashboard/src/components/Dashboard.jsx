import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { AiOutlineDelete, AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); 
  const [registeredDoctors, setRegisteredDoctors] = useState(0); 


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
      }
    };
    // Fetch registered doctors
    const fetchDoctorCount = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/appointment/total-doctors", { withCredentials: true });
        setRegisteredDoctors(response.data.totalDoctors);
      } catch (error) {
        toast.error("Failed to fetch total doctors");
      }
    };

    fetchAppointments();
    fetchDoctorCount();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Delete appointment
  const deleteAppointment = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this appointment?');
    if (!confirm) return;
  
    try {
      const { data } = await axios.delete(
        `http://localhost:4000/api/v1/appointment/delete/${id}`,
        { withCredentials: true } 
      );
  
      // Update the state to reflect deletion
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appt) => appt._id !== id)
      );
  
      toast.success(data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete appointment"
      );
    }
  };
  
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  // sort
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(a.bookingTime);
    const dateB = new Date(b.bookingTime);

    if (isNaN(dateA) || isNaN(dateB)) {
      return 0; 
    }

    if (sortOrder === "desc") {
      return dateA - dateB; // asc order
    } else {
      return dateB - dateA; // dec order
    }
  });

  // status fcfs
  const getNextAppointmentInLine = () => {
    return sortedAppointments.find((appointment) => appointment.status === "Pending");
  };

  // update fcfs
  const isStatusUpdatable = (index) => {
    for (let i = 0; i < index; i++) {
      if (sortedAppointments[i].status === "Pending") {
        return false; // pending change not then no acc reg
      }
    }
    return true; 
  };

  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc.png" alt="docImg" />
            <div className="content">
              <div>
                <p>Hello ,</p>
                <h5>
                  {admin && `${admin.firstName} ${admin.lastName}`}
                </h5>
              </div>
              <p>

              </p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total Appointments</p>
            <h3>{appointments.length || 0}</h3> {/* Dynamic Appointment count */}
          </div>
          <div className="thirdBox">
            <p>Registered Doctors</p>
            <h3>{registeredDoctors || 0}</h3> {/* Dynamic Doctor count */}
          </div>
        </div>
        <div className="banner">
          <h5>Appointments</h5>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Status</th>
                <th>Visited</th>
                <th onClick={toggleSortOrder} style={{ cursor: "pointer" }}>
                  <span>
                    {sortOrder === "asc" ? (
                      <AiOutlineArrowUp />
                    ) : (
                      <AiOutlineArrowDown />
                    )}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAppointments && sortedAppointments.length > 0
                ? sortedAppointments.map((appointment, index) => {
                  // check fcfs pending wa ma
                  const isNextInLine = appointment.status === "Pending" && index === 0;

                  return (
                    <tr key={appointment._id}>
                      <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                      <td>{appointment.bookingTime ? new Date(appointment.bookingTime).toLocaleString() : "No Booking Time"}</td>
                      <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                      <td>{appointment.department}</td>

                      <td>
                        <select
                          className={
                            appointment.status === "Pending"
                              ? "value-pending"
                              : appointment.status === "Accepted"
                                ? "value-accepted"
                                : "value-rejected"
                          }
                          value={appointment.status}
                          onChange={(e) => {
                            if (isStatusUpdatable(index)) {
                              handleUpdateStatus(appointment._id, e.target.value);
                            } else {
                              toast.error("Please update previous appointments first.");
                            }
                          }}
                          disabled={!isStatusUpdatable(index)} // Disable status change if it's not updatable   //is not null
                        >
                          <option value="Pending" className="value-pending">Pending</option> 
                          <option value="Accepted" className="value-accepted">Accepted</option>
                          <option value="Rejected" className="value-rejected">Rejected</option>
                        </select>
                      </td>
                      <td>
                        {appointment.hasVisited ? (
                          <GoCheckCircleFill className="green" />
                        ) : (
                          <AiFillCloseCircle className="red" />
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => deleteAppointment(appointment._id)}
                          className="delete-button"
                          style={{
                            backgroundColor: "#393E46",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          <AiOutlineDelete /> Delete
                        </button>
                      </td>
                    </tr>

                  );
                })
                : <tr>
                  <td>No Appointments Found!</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Dashboard;