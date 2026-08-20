import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiChevronDown, FiSearch, FiSettings, FiUser, FiLogOut } from "react-icons/fi";
import { getMyTeams } from "../../api/teamApi";

function Navbar() {

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [teams, setTeams] = useState([]);
    const [activeTeamId, setActiveTeamId] = useState(localStorage.getItem("activeTeamId") || "");

    const name = localStorage.getItem("name") || "User";
    const email = localStorage.getItem("email") || "";

    useEffect(() => {
        async function loadTeams() {
            try {
                const data = await getMyTeams();
                setTeams(data.teams || []);

                if (!localStorage.getItem("activeTeamId") && data.teams?.length) {
                    localStorage.setItem("activeTeamId", String(data.teams[0].id));
                    setActiveTeamId(String(data.teams[0].id));
                }
            } catch (error) {
                console.error(error);
            }
        }

        loadTeams();
    }, []);

    function logout() {

        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("activeTeamId");

        navigate("/login");

    }

    function handleTeamChange(teamId) {
        localStorage.setItem("activeTeamId", String(teamId));
        setActiveTeamId(String(teamId));
        setOpen(false);
        navigate(0);
    }

    return (

        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">

            <div className="relative w-96">

                <FiSearch
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                />

                <input
                    type="text"
                    placeholder="Search bugs..."
                    className="w-full rounded-xl border border-slate-300 pl-11 pr-4 py-3 outline-none focus:border-blue-500"
                />

            </div>

            <div className="flex items-center gap-6">

                <div className="relative">
                    <select
                        value={activeTeamId}
                        onChange={(e) => handleTeamChange(e.target.value)}
                        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium bg-white"
                    >
                        {teams.length > 0 ? teams.map((team) => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                        )) : <option value="">No teams</option>}
                    </select>
                </div>

                <button
                    className="relative p-2 rounded-xl hover:bg-slate-100 transition"
                >
                    <FiBell
                        size={22}
                    />
                </button>

                <div className="relative">

                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-slate-100 transition"
                    >

                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">

                            {name.charAt(0).toUpperCase()}

                        </div>

                        <div className="text-left">

                            <p className="font-semibold">

                                {name}

                            </p>

                            <p className="text-xs text-slate-500">

                                {email}

                            </p>

                        </div>

                        <FiChevronDown />

                    </button>

                    {
                        open && (

                            <div className="absolute right-0 mt-3 w-60 rounded-xl bg-white shadow-xl border border-slate-200 overflow-hidden">

                                <button
                                    onClick={() => navigate("/settings")}
                                    className="flex items-center gap-3 w-full px-5 py-3 hover:bg-slate-100"
                                >

                                    <FiUser />

                                    Profile

                                </button>

                                <button
                                    onClick={() => navigate("/settings")}
                                    className="flex items-center gap-3 w-full px-5 py-3 hover:bg-slate-100"
                                >

                                    <FiSettings />

                                    Settings

                                </button>

                                <button
                                    onClick={logout}
                                    className="flex items-center gap-3 w-full px-5 py-3 text-red-600 hover:bg-red-50"
                                >

                                    <FiLogOut />

                                    Logout

                                </button>

                            </div>

                        )
                    }

                </div>

            </div>

        </header>

    );

}

export default Navbar;