import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/appointments/all-fcfs');
        setAppointments(response.data.appointments);
      } catch (error) {
        setError('Error fetching appointments');
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) {
    return <p>Loading appointments...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Appointments (First-Come, First-Served)</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment._id}>
            <strong>Patient:</strong> {appointment.patientName}, <strong>Doctor:</strong> {appointment.doctorName}, 
            <strong> Department:</strong> {appointment.department}, 
            <strong>Appointment Date:</strong> {new Date(appointment.appointmentDate).toLocaleString()}, 
            <strong>Booked At:</strong> {new Date(appointment.bookingTime).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;
