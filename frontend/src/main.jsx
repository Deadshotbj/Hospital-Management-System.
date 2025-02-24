import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Create Context for global state management
export const Context = createContext({
  isAuthenticated: false,
  symptomsResults: [],
  setSymptomsResults: () => {},
  appointments: [],
  setAppointments: () => {},
});

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [symptomsResults, setSymptomsResults] = useState([]); // State for symptoms results
  const [appointments, setAppointments] = useState([]); // State for appointments

  return (
    <Context.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        symptomsResults, // Share symptoms results globally
        setSymptomsResults, // Function to update symptoms results
        appointments, // Share appointments globally
        setAppointments, // Function to update appointments
      }}
    >
      <App />
    </Context.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
