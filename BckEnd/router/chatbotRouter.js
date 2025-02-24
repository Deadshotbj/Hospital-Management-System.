import express from "express";
import axios from "axios";

const router = express.Router();

// usimg flask know symptoms
router.post("/analyze-symptoms", async (req, res) => {
  try {
    const { symptoms } = req.body;

    // Validate symptoms
    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ error: "Symptoms must be a non-empty array." });
    }

    console.log("Symptoms being sent to Flask:", symptoms);  // Log the symptoms

    // Send symptoms to Flask
    const flaskResponse = await axios.post("http://localhost:5000/predict", { symptoms });

    console.log("Flask response:", flaskResponse.data);  // Log Flask response

    // Ensure the response is an array
    if (!Array.isArray(flaskResponse.data)) {
      return res.status(500).json({ error: "Unexpected response format from Flask service." });
    }

    res.json(flaskResponse.data);
  } catch (error) {
    console.error("Error communicating with Flask service:", error.message);
    if (error.response) {
      console.error("Flask Response Error:", error.response.data);  // Logs response from Flask if available
    }
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
