import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EsewaHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Log to verify if payment was successful
        console.log("Payment successful. Redirecting to appointment page...");
        
        // Add a timeout before redirection (optional for better UX)
        setTimeout(() => {
            console.log("Navigating to /appointment...");
            navigate("/appointment");
        }, 2000);
    }, [navigate]);

    return (
        <div>
            <h1>Payment Successful</h1>
            <p>Redirecting to your appointment page...</p>
        </div>
    );
};

export default EsewaHandler;
