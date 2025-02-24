import mongoose from "mongoose";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

// Create a new appointment
export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body;

  // Validating fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    return next(new ErrorHandler("Please fill in all required fields!", 400));
  }

  // Find the doctor based on the provided details
  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });

  // doctor exist or not
  if (isConflict.length === 0) {
    return next(new ErrorHandler("Doctor not found!", 404));
  }

  if (isConflict.length > 1) {
    return next(
      new ErrorHandler("Doctor conflict! Please contact support.", 400)
    );
  }

  const doctorId = isConflict[0]._id;
  const patientId = req.user._id; 

  // Create a new appointment with booking time
  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited: hasVisited || false,
    address,
    doctorId,
    patientId,
    bookingTime: new Date(), 
  });

  res.status(200).json({
    success: true,
    appointment,
    message: "Appointment created successfully!",
  });
});

// fcfs
export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  // asc order
  const appointments = (await Appointment.find().sort({ bookingTime: 1 })).reverse();
  res.status(200).json({
    success: true,
    appointments,
  });
});
// total number of appoin
export const getTotalAppointments = catchAsyncErrors(async (req, res, next) => {
  try {
    const totalAppointments = await Appointment.countDocuments();
    res.status(200).json({
      success: true,
      totalAppointments,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to fetch total appointments", 500));
  }
});

// total num of doc
export const getTotalDoctors = catchAsyncErrors(async (req, res, next) => {
  try {
    const totalDoctors = await User.countDocuments({ role: "Doctor" });
    res.status(200).json({
      success: true,
      totalDoctors,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to fetch total doctors", 500));
  }
});

// Update appointment status

export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }
    appointment = await Appointment.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    // accept gareko or reject
    if (appointment.status === "accepted" || appointment.status === "rejected") {
      //trying notification ho
      const patient = await User.findById(appointment.patientId);
      console.log("Patient Device Token:", patient.deviceToken); 

      if (patient && patient.deviceToken) {
        const message = {
          notification: {
            title: "Appointment Status Updated",
            body: `Your appointment has been ${appointment.status}`,
          },
          data: {
            status: appointment.status,  
            appointmentId: appointment._id.toString(),
          },
          token: patient.deviceToken,  
        };
        console.log("Sending push notification:", message);  

      // notification try ho from firebase
        try {
          await messaging.send(message);
          console.log("Notification sent successfully!",message);
        } catch (error) {
          console.error("Error sending notification:", error);
        }
      }else {
        console.warn("Patient does not have a valid device token. Notification not sent.");
      }
    }

    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully!",
      appointment,
    });
  }
);

// appont delete
export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // user ko appoint mongoose ma check
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Appointment ID!",
    });
  }

  // id khojeko
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    return next(new ErrorHandler("Appointment not found!", 404));
  }

  await appointment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Appointment deleted successfully!",
  });
});

// Get user's appointments
export const getUserAppointments = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;  // Get the logged-in user's ID from the authentication middleware

  // Find appointments for the logged-in user
  const appointments = await Appointment.find({ patientId: userId }).populate('doctorId', 'firstName lastName');

  if (!appointments || appointments.length === 0) {
    return next(new ErrorHandler("No appointments found for this user.", 404));
  }

  res.status(200).json({
    success: true,
    appointments,
  });
});
