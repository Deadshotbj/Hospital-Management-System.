"use client";

import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";


let form = null;
const Esewa = () => {
    function generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    const [paymentParams, setPaymentParams] = useState({
        amount: "100.5",
        failure_url: "http://localhost:4000/esewa",
        product_delivery_charge: "0",
        product_service_charge: "0",
        product_code: "EPAYTEST",
        signature: "",
        signed_field_names: "total_amount,transaction_uuid,product_code",
        success_url: "http://localhost:4000/esewa",
        tax_amount: "0",
        total_amount: "100.5",
        transaction_uuid: `heartwood-${generateOTP()}`,
    });
    useEffect(() => {
        const post = () => {
            form = document.createElement("form");
            form.setAttribute("method", "POST");
            form.setAttribute("target", "_blank");
            form.setAttribute(
                "action",
                "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
            );

            for (const key in paymentParams) {
                const hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute(
                    "value",
                    paymentParams[key],
                ); // Add index signature
                form.appendChild(hiddenField);
            }

            document.body.appendChild(form);
        };

        post();
    }, [paymentParams]);

    const checkStatus = async () => {
        fetch(
            `https://uat.esewa.com.np/api/epay/transaction/status/?product_code=EPAYTEST&total_amount=${paymentParams.total_amount}&transaction_uuid=${paymentParams.transaction_uuid}`,
        );
        console.log(
            `https://uat.esewa.com.np/api/epay/transaction/status/?product_code=EPAYTEST&total_amount=${paymentParams.total_amount}&transaction_uuid=${paymentParams.transaction_uuid}`,
        );
    };

    const generateSignature = async () => {
        const message = `total_amount=${paymentParams.total_amount},transaction_uuid=${paymentParams.transaction_uuid},product_code=${paymentParams.product_code}`;
        const secret = "8gBm/:&EnhH.1/q";
        console.log(message)
        console.log(secret)

        const hash = CryptoJS.HmacSHA256(message, secret).toString(CryptoJS.enc.Base64);
        console.log("hash",hash)
        setPaymentParams({ ...paymentParams, signature: hash });
    };

    const handleSubmit = () => {
        form.submit();
    };

    return (
        <>
            <div

                style={{
                    display: "flex",
                    height: "100%",
                    width: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "3rem",
                    background: "gray"
                }}>

                <p>transaction_uuid: {paymentParams.transaction_uuid}</p>
                <p>Hash: {paymentParams.signature}</p>
                <button onClick={generateSignature} style={{ padding: "1rem", margin: "1rem", border: "1px solid red" }}>
                    Hash
                </button>
                <button onClick={handleSubmit} style={{ padding: "1rem", margin: "1rem", border: "1px solid red" }}>
                    Submit
                </button>
                <button onClick={checkStatus}>Check Status</button>
                <p>apple</p>
            </div>
        </>
    );
}

export default Esewa;