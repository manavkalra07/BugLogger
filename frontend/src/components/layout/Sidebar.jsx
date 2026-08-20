import { NavLink, useNavigate } from "react-router-dom";
import {
    FiHome,
    FiUser,
    FiUsers,
    FiSettings,
    FiLogOut
} from "react-icons/fi";

import { FaBug } from "react-icons/fa";

function Sidebar() {

    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        navigate("/login");
    }

    const menuClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isActive
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`;

    return (
        <aside className="w-[260px] min-h-screen bg-slate-900 text-white flex flex-col">

            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold">
                    🐞 BugLogger
                </h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">

                <NavLink
                    to="/dashboard"
                    className={menuClass}
                >
                    <FiHome size={20} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/bugs"
                    className={menuClass}
                >
                    <FaBug size={20} />
                    <span>Bugs</span>
                </NavLink>

                <NavLink
                    to="/dashboard"
                    className={menuClass}
                >
                    <FiUser size={20} />
                    <span>Assigned To Me</span>
                </NavLink>

                <NavLink
                    to="/team"
                    className={menuClass}
                >
                    <FiUsers size={20} />
                    <span>Team</span>
                </NavLink>

                <NavLink
                    to="/settings"
                    className={menuClass}
                >
                    <FiSettings size={20} />
                    <span>Settings</span>
                </NavLink>

            </nav>

            <div className="p-4 border-t border-slate-800">

                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all"
                >
                    <FiLogOut size={20} />
                    Logout
                </button>

            </div>

        </aside>
    );

}

export default Sidebar;