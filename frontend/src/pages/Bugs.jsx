import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import BugCard from "../components/BugCard";
import CreateBugModal from "../components/CreateBugModal";

function Bugs() {
    const [bugs, setBugs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const activeTeamId = localStorage.getItem("activeTeamId");

    async function fetchBugs() {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:5000/api/bugs", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "x-team-id": activeTeamId || "",
                },
            });

            const data = await response.json();

            if (response.ok) {
                setBugs(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchBugs();
    }, []);

    return (
        <Layout>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold text-slate-800">
                    Bugs
                </h1>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
                >
                    + New Bug
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search bugs..."
                        className="flex-1 border rounded-xl px-4 py-3"
                    />

                    <select className="border rounded-xl px-4 py-3">
                        <option>All Status</option>
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                        <option>Closed</option>
                    </select>

                    <select className="border rounded-xl px-4 py-3">
                        <option>Newest First</option>
                        <option>Oldest First</option>
                    </select>
                </div>

                <div className="space-y-4">
                    {bugs.length > 0 ? (
                        bugs.map((bug) => (
                            <BugCard
                                key={bug.id}
                                bug={bug}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 text-slate-500">
                            No bugs found.
                        </div>
                    )}
                </div>
            </div>

            <CreateBugModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onBugCreated={() => {
                    fetchBugs();
                    setIsModalOpen(false);
                }}
            />
        </Layout>
    );
}

export default Bugs;