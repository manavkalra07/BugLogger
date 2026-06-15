import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyOTP() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");

        const response = await fetch(
            "http://localhost:5000/api/auth/verify-otp",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    otp
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            setError(data.message);
            return;
        }

        navigate("/reset-password", {
            state: {
                email,
                otp
            }
        });
    }

    return (
        <div>
            <h1>Verify OTP</h1>

            {error && <p>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />

                <button type="submit">
                    Verify OTP
                </button>
            </form>
        </div>
    );
}

export default VerifyOTP;