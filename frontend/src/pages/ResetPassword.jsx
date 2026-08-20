import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;
    const otp = location.state?.otp;

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        const response = await fetch(
            "http://localhost:5000/api/auth/reset-password",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    otp,
                    newPassword
                })
            }
        );

        const data = await response.json();
        if (!response.ok) {
            setError(data.message);
            return;
        }
        alert("Password reset successful");
        navigate("/login");
    }

    return (
        <div>
            <h1>Reset Password</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button type="submit">
                    Reset Password
                </button>
            </form>
        </div>
    );
}


export default ResetPassword;