import { useNavigate } from "react-router-dom";
import { useState, useEffect} from "react";
function Register() {
    const [name, setName ] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [organisation_name, setOrganisatiName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("")
        const response = await fetch(
            "http://localhost:5000/api/users",
            {
                method : "POST",
                headers : {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    organisation_name,
                }),
            }
        )
        console.log(response.status);   
        const data = await response.json();
        if (response.status !== 201) {
            setError(data.message);
            return;
        }
        navigate("/login")
    }

    return (
        <div className="login-container">
            <h1>Register</h1>
            {error && <p>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                <div className="form-group">
                    <label htmlFor="email">Organisation:</label>
                    <input
                        type="text"
                        id="organisation_name"
                        value={organisation_name}
                        onChange={(e) => setOrganisatiName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
export default Register;