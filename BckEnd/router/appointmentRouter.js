
import express from "express";
import {
  deleteAppointment,
  getAllAppointments,
  postAppointment,
  updateAppointmentStatus,
  getTotalAppointments, 
  getTotalDoctors,
  getUserAppointments, 

} from "../controller/appointmentController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isPatientAuthenticated, postAppointment);

router.get("/getall-fcfs", isAdminAuthenticated, getAllAppointments);

router.get("/getall", isAdminAuthenticated, getAllAppointments);

router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);

router.get("/total", isAdminAuthenticated, getTotalAppointments);

router.get("/total-doctors", isAdminAuthenticated, getTotalDoctors);

router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);

router.get("/my-appointments", isPatientAuthenticated, getUserAppointments);  


export default router;
