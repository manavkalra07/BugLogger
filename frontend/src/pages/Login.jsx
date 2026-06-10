import { useNavigate } from "react-router-dom";
import { useState, useEffect} from "react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");
        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method : "POST",
                headers : {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            }
        );
        console.log(response.status);   
        const data = await response.json();
        if (response.status == 401) {
            setError(data.message);
            return;
        }
        console.log("FULL DATA:", data);
        console.log("TOKEN:", data.token);  
        const value = data.token;
        localStorage.setItem("token", value)
        navigate("/dashboard")
        console.log(data);
        console.log(
        localStorage.getItem("token")
        );
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            {error && <p>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
export default Login;