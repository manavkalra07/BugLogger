import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { createTeam, getMyTeams, inviteTeamMember } from "../api/teamApi";

function Team() {
    const [teams, setTeams] = useState([]);
    const [teamName, setTeamName] = useState("");
    const [inviteEmail, setInviteEmail] = useState("");
    const [selectedTeamId, setSelectedTeamId] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function loadTeams() {
        try {
            const data = await getMyTeams();
            setTeams(data.teams || []);
            if (data.teams?.length) {
                setSelectedTeamId(String(data.teams[0].id));
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Unable to load teams.");
        }
    }

    useEffect(() => {
        loadTeams();
    }, []);

    async function handleCreateTeam(e) {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            await createTeam({ name: teamName });
            setTeamName("");
            await loadTeams();
            setMessage("Team created successfully.");
        } catch (err) {
            setError(err?.response?.data?.message || "Unable to create team.");
        }
    }

    async function handleInvite(e) {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            await inviteTeamMember({ team_id: Number(selectedTeamId), email: inviteEmail });
            setInviteEmail("");
            setMessage("Invitation sent successfully.");
        } catch (err) {
            setError(err?.response?.data?.message || "Unable to invite member.");
        }
    }

    return (
        <Layout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Teams</h1>
                    <p className="text-slate-600 mt-2">Create teams and invite members for the active organization.</p>
                </div>

                {message && <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-green-700">{message}</div>}
                {error && <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">{error}</div>}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <form onSubmit={handleCreateTeam} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">Create Team</h2>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Team name</label>
                        <input
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-4"
                            placeholder="Frontend Team"
                        />
                        <button className="bg-blue-600 text-white px-5 py-3 rounded-xl">Create Team</button>
                    </form>

                    <form onSubmit={handleInvite} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">Invite Member</h2>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Select team</label>
                        <select
                            value={selectedTeamId}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-4"
                        >
                            {teams.length > 0 ? teams.map((team) => (
                                <option key={team.id} value={team.id}>{team.name}</option>
                            )) : <option value="">No teams available</option>}
                        </select>

                        <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
                        <input
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-4"
                            placeholder="member@company.com"
                        />
                        <button className="bg-slate-800 text-white px-5 py-3 rounded-xl">Send Invite</button>
                    </form>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">My Teams</h2>
                    <div className="space-y-3">
                        {teams.length > 0 ? teams.map((team) => (
                            <div key={team.id} className="rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-slate-800">{team.name}</p>
                                    <p className="text-sm text-slate-500">Role: {team.role}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        localStorage.setItem("activeTeamId", String(team.id));
                                        window.location.reload();
                                    }}
                                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg"
                                >
                                    Switch
                                </button>
                            </div>
                        )) : <p className="text-slate-500">No teams yet.</p>}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Team;