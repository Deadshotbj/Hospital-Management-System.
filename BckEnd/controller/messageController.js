
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Message } from "../models/messageSchema.js";

// nnew msg
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, message } = req.body;

  // fields test
  if (!firstName || !lastName || !email || !phone || !message) {
    return next(new ErrorHandler("Please fill in all required fields!", 400));
  }

  // create
  await Message.create({ firstName, lastName, email, phone, message });

  res.status(200).json({
    success: true,
    message: "Message sent successfully!",
  });
});

// fcfs acs
export const getAllMessages = catchAsyncErrors(async (req, res, next) => { 
  const messages = await Message.find().sort({ createdAt: 1 });
  res.status(200).json({
    success: true,
    messages,
  });
});
