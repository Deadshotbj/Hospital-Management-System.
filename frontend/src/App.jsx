import React, { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Appointment from "./Pages/Appointment";
import AboutUs from "./Pages/AboutUs";
import Register from "./Pages/Register";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Context } from "./main";
import Login from "./Pages/Login";
import SymptomChatbot from "./components/SymptomChatbot";  
import AppointmentList from "./components/AppointmentList";
import Esewa from "./components/Esewa";
import UserPortal from "./components/UserPortal"; // Correct import
// Placeholder components for missing routes
const PaymentForm = () => <div>Payment Form Placeholder</div>;
const PaymentSuccess = () => <div>Payment Success Placeholder</div>;
const PaymentFailure = () => <div>Payment Failure Placeholder</div>;

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/patient/me",
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/appointments-fcfs" element={<AppointmentList />} /> 
        <Route path="/symptom-checker" element={<SymptomChatbot />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-portal" element={<UserPortal />} /> {/* New Route */}
        <Route path="/esewa" element={<Esewa />} />
        <Route path="/payment-form" element={<PaymentForm />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
      </Routes>
      <Footer />
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
