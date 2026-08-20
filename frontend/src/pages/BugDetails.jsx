import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import EditBugModal from "../components/EditBugModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import BugHeader from "../components/bug/BugHeader";
import BugDescription from "../components/bug/BugDescription";
import AssignUser from "../components/bug/AssignUser";
import StatusDropdown from "../components/bug/StatusDropdown";
import ActivityTimeline from "../components/bug/ActivityTimeline";
import CommentsSection from "../components/bug/CommentsSection";
import { deleteBug as deleteBugApi, getBugById } from "../api/bugApi";
import { getAllUsers } from "../api/userApi";

function BugDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [bug, setBug] = useState(null);
    const [users, setUsers] = useState([]);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const activeTeamId = localStorage.getItem("activeTeamId");

    async function fetchBug() {
        try {
            const data = await getBugById(id);
            setBug(data);
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchUsers() {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const storedTeamId = localStorage.getItem("activeTeamId");
        if (storedTeamId) {
            localStorage.setItem("activeTeamId", storedTeamId);
        }
    }, []);

    useEffect(() => {
        fetchBug();
        fetchUsers();
    }, [id]);

    async function deleteBug() {
        try {
            setLoading(true);
            await deleteBugApi(id);
            alert("Bug deleted successfully");
            navigate("/bugs");
        } catch (error) {
            alert(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    if (!bug) {
        return (
            <Layout>
                <div className="text-center text-xl mt-20">
                    Loading...
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <button
                onClick={() => navigate("/bugs")}
                className="mb-6 bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-lg"
            >
                ← Back
            </button>

            <div className="bg-white rounded-2xl shadow-sm border p-8">
                <BugHeader
                    bug={bug}
                    onEdit={() => setIsEditOpen(true)}
                    onDelete={() => setIsDeleteOpen(true)}
                />

                <hr className="my-8" />

                <BugDescription bug={bug} />
                <AssignUser
                    bug={bug}
                    users={users}
                    onAssigned={() => fetchBug()}
                />
                <StatusDropdown
                    bug={bug}
                    onStatusUpdated={() => fetchBug()}
                />
                <CommentsSection bugId={bug.id} />
                <ActivityTimeline bugId={bug.id} />
            </div>

            <EditBugModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                bug={bug}
                onBugUpdated={() => {
                    fetchBug();
                    setIsEditOpen(false);
                }}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={deleteBug}
                loading={loading}
            />
        </Layout>
    );
}

export default BugDetails;