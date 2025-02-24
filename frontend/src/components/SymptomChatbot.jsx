import React, { useState, useContext } from "react";
import axios from "axios";
import { Context } from "../main"; // Import Context to access global state

// CSS for Spinner
const spinnerStyles = {
  marginLeft: "10px",
  border: "4px solid #f3f3f3",
  borderTop: "4px solid #3498db",
  borderRadius: "50%",
  width: "16px",
  height: "16px",
  animation: "spin 2s linear infinite",
};

const SymptomChatbot = () => {
  const [symptoms, setSymptoms] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 
  const { symptomsResults, setSymptomsResults } = useContext(Context); // Access results from context
 
 
  const handleAnalyzeSymptoms = async () => {
    if (symptoms.trim() === "") return;
  
    setLoading(true);
    setError("");
  
    try {
      const symptomArray = symptoms.split(",").map((symptom) => symptom.trim());
      setTimeout(async () => {
        try {
          const response = await axios.post(
            "http://localhost:4000/api/v1/chatbot/analyze-symptoms",
            { symptoms: symptomArray }
          );
  
          // backend check
          if (Array.isArray(response.data) && response.data.length > 0) {
            const timestamp = new Date().toLocaleString(); // Get current date and time
            const resultsWithTimestamp = response.data.map((result) => ({
              ...result,
              analyzedAt: timestamp, // Add the timestamp to each symptom result
            }));
  
            setSymptomsResults(resultsWithTimestamp); // Set results globally in context
  
            // Update localStorage with the new results
            const currentSymptoms = JSON.parse(localStorage.getItem("symptomsResults")) || [];
            const updatedSymptoms = [...currentSymptoms, ...resultsWithTimestamp]; // Append new symptoms with timestamp
            localStorage.setItem("symptomsResults", JSON.stringify(updatedSymptoms)); // Save updated symptoms to localStorage
          } else {
            setSymptomsResults([]); // Clear results if no data
            setError("No analysis results found.");
          }
        } catch (error) {
          console.error("Error occurred during symptom analysis:", error); // Log full error details for debugging
          setSymptomsResults([]); // Clear results if error occurs
          setError("Error analyzing symptoms. Please try again.");
        } finally {
          setLoading(false);
        }
      }, 5000);
    } catch (error) {
      setSymptomsResults([]); // Clear results if error occurs
      setError("Error analyzing symptoms. Please try again.");
      setLoading(false);
    }
  };
  
  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <img
          src="/chatbot.png"
          alt="Chatbot Logo"
          className="chatbot-image"
        />
        <h2>Symptom Analysis Chatbot</h2>
      </div>

      <textarea
        rows="3"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        placeholder="Enter symptoms (comma-separated, e.g., 'Dry Eyes, Double Vision')"
      />
      <button onClick={handleAnalyzeSymptoms} disabled={loading}>
        {loading ? (
          <>
            Analyzing...
            <div style={spinnerStyles}></div>
          </>
        ) : (
          "Analyze Symptoms"
        )}
      </button>

      {error && <div className="error-message">{error}</div>}

      {/** Render Results */}
      {/* Access results from the context and map over them */}
      <div className="results">
        <h3>Analysis Results:</h3>
        <ul>
          {symptomsResults && symptomsResults.length > 0 ? (
            symptomsResults.map((result, index) => (
              <li key={index}>
                <div className="result-box">
                  <h4>Symptom:</h4>
                  <p>{result.symptom}</p>
                </div>

                <div className="result-box">
                  <h4>Department:</h4>
                  <p>{result.department || "N/A"}</p>
                </div>

                <div className="result-box">
                  <h4>Recommended Tests:</h4>
                  <p>
                    {result.recommended_tests && result.recommended_tests.length > 0
                      ? result.recommended_tests.join(", ")
                      : "No tests available for this symptom"}
                  </p>
                </div>
              </li>
            ))
          ) : (
            <div className="no-results">No results to display.</div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SymptomChatbot;
