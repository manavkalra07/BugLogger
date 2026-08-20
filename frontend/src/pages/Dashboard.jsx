import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/layout/Layout";
import StatsCard from "../components/StatsCard";
import RecentBugs from "../components/RecentBugs";
import AssignedBugs from "../components/AssignedBugs";

function Dashboard() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");
const activeTeamId = localStorage.getItem("activeTeamId");

    const [stats, setStats] = useState({
        totalBugs: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0
    });

    const [recentBugs, setRecentBugs] = useState([]);
    const [assignedBugs, setAssignedBugs] = useState([]);
    useEffect(() => {

        if (!token) {
            navigate("/login");
            return;
        }

        async function fetchDashboard() {

            try {

                const statsResponse = await fetch(
                    "http://localhost:5000/api/dashboard/stats",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "x-team-id": activeTeamId || ""
                        }
                    }
                );

                const statsData = await statsResponse.json();

                setStats(statsData);

                const recentResponse = await fetch(
                    "http://localhost:5000/api/dashboard/recent",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "x-team-id": activeTeamId || ""
                        }
                    }
                );

                const recentData = await recentResponse.json();

                setRecentBugs(recentData);
                const assignedResponse = await fetch(
                    "http://localhost:5000/api/dashboard/assigned",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "x-team-id": activeTeamId || ""
                        }
                    }
                );

                const assignedData = await assignedResponse.json();

                setAssignedBugs(assignedData);
            }
            catch (error) {

                console.log(error);

            }

        }

        fetchDashboard();

    }, []);

    return (

        <Layout>

            <h1 className="text-3xl font-bold text-slate-800 mb-8">

                Dashboard

            </h1>

            <div className="grid grid-cols-5 gap-6 mb-8">

                <StatsCard
                    title="Total Bugs"
                    value={stats.totalBugs}
                />

                <StatsCard
                    title="Open"
                    value={stats.open}
                />

                <StatsCard
                    title="In Progress"
                    value={stats.inProgress}
                />

                <StatsCard
                    title="Resolved"
                    value={stats.resolved}
                />

                <StatsCard
                    title="Closed"
                    value={stats.closed}
                />

            </div>

            <div className="space-y-8">

                <RecentBugs bugs={recentBugs} />

                <AssignedBugs bugs={assignedBugs} />

            </div>

        </Layout>

    );

}

export default Dashboard;