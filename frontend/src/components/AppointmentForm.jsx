import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AppointmentForm = () => {
  const [user, setUser] = useState({});
  const [appointmentDate, setAppointmentDate] = useState("");
  const [department, setDepartment] = useState("Pediatrics");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);

  const departmentsArray = [
    "Optometrists",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];

  const [doctors, setDoctors] = useState([]);

  // Fetch user details and doctors
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const userResponse = await axios.get(
          "http://localhost:4000/api/v1/user/patient/me",
          { withCredentials: true }
        );
        setUser(userResponse.data.user);

        const doctorsResponse = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(doctorsResponse.data.doctors);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch data.");
      }
    };
    fetchDetails();
  }, []);

  const handlePayment = async () => {
    try {
      const amount = 500; // Fixed amount for appointment
      const esewaConfig = {
        amt: amount,
        psc: 0,
        pdc: 0,
        txAmt: 0,
        tAmt: amount,
        pid: `Appointment-${Date.now()}`,
        scd: "EPAYTEST",
        su: "http://localhost:5173/api/v1/payment/success",
        fu: "http://localhost:5173/api/v1/payment/failure",
      };

      const esewaUrl = `https://uat.esewa.com.np/epay/main?amt=${esewaConfig.amt}&psc=${esewaConfig.psc}&pdc=${esewaConfig.pdc}&txAmt=${esewaConfig.txAmt}&tAmt=${esewaConfig.tAmt}&pid=${esewaConfig.pid}&scd=${esewaConfig.scd}&su=${esewaConfig.su}&fu=${esewaConfig.fu}`;
      window.location.href = esewaUrl; // Redirect to eSewa
    } catch (error) {
      toast.error("Payment Failed. Please try again.");
    }
  };

  const handleAppointment = async (e) => {
    e.preventDefault();
    if (!appointmentDate || !department || !doctorFirstName || !doctorLastName || !address) {
      toast.error("Please fill in all the fields before proceeding.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/appointment/post",
        {
          ...user,
          appointment_date: appointmentDate,
          department,
          doctor_firstName: doctorFirstName,
          doctor_lastName: doctorLastName,
          hasVisited,
          address,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      handlePayment();
      setAppointmentDate("");
      setDepartment("");
      setDoctorFirstName("");
      setDoctorLastName("");
      setAddress("");
      setHasVisited(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create appointment.");
    }
  };

  return (
    <div className="container form-component appointment-form">
      <h2>Appointment</h2>
      <form onSubmit={handleAppointment}>
        <div>
          <input
            type="text"
            placeholder="First Name"
            value={user.firstName || ""}
            readOnly
          />
          <input
            type="text"
            placeholder="Last Name"
            value={user.lastName || ""}
            readOnly
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Email"
            value={user.email || ""}
            readOnly
          />
          <input
            type="number"
            placeholder="Mobile Number"
            value={user.phone || ""}
            readOnly
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="NIC"
            value={user.nic || ""}
            readOnly
          />
          <input
            type="date"
            placeholder="Date of Birth"
            value={user.dob ? new Date(user.dob).toISOString().split("T")[0] : ""}
            readOnly
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Gender"
            value={user.gender || ""}
            readOnly
          />
          <input
            type="date"
            placeholder="Appointment Date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
          />
        </div>
        <div>
          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setDoctorFirstName("");
              setDoctorLastName("");
            }}
          >
            {departmentsArray.map((depart, index) => (
              <option value={depart} key={index}>
                {depart}
              </option>
            ))}
          </select>
          <select
            value={`${doctorFirstName} ${doctorLastName}`}
            onChange={(e) => {
              const [firstName, lastName] = e.target.value.split(" ");
              setDoctorFirstName(firstName);
              setDoctorLastName(lastName);
            }}
            disabled={!department}
          >
            <option value="">Select Doctor</option>
            {doctors
              .filter((doctor) => doctor.doctorDepartment === department)
              .map((doctor, index) => (
                <option
                  value={`${doctor.firstName} ${doctor.lastName}`}
                  key={index}
                >
                  {doctor.firstName} {doctor.lastName}
                </option>
              ))}
          </select>
        </div>
        <textarea
          rows="2"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
        />
        <div>
          <p style={{ marginBottom: 0 }}>Have you visited before?</p>
          <input
            type="checkbox"
            checked={hasVisited}
            onChange={(e) => setHasVisited(e.target.checked)}
            style={{ flex: "none", width: "25px" }}
          />
        </div>
        <button>GET APPOINTMENT</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
