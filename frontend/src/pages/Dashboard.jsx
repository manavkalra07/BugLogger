import { useNavigate } from "react-router-dom";
import { useEffect} from "react";

function Dashboard() {

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    function Logout() {
        
        localStorage.removeItem("token");
        navigate("/login");
    }
    useEffect(() => {
        // dashboard initialization logic
        if (!token){
        navigate("/login");
        return;
        }

        async function fetchDashboard() {
            const response = await fetch(
                "http://localhost:5000/api/dashboard",
                {
                    method : "GET",
                    headers : {
                        Authorization: `Bearer ${token}`
                    },
                }
         );

         const data = await response.json();
         console.log(data);
     }
    fetchDashboard();
    }, []);  

    return (
        <div>
            <div>
                <h1>Dashboard</h1>
            </div>
            <button onClick={Logout}>
                     Logout
            </button>
        </div>
    );
}
export default Dashboard;