import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { getInvitationByToken, respondToInvitation } from "../api/teamApi";

function Invite() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const boot = async () => {
            try {
                const tokenValue = token;
                const data = await getInvitationByToken(tokenValue);
                setInvitation(data);
            } catch (err) {
                setError(err?.response?.data?.message || "Invitation could not be loaded.");
            } finally {
                setLoading(false);
            }
        };

        boot();
    }, [token]);

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem("token");

        if (!tokenFromStorage && invitation?.email) {
            navigate(`/login?invite=${token}`, { replace: true });
        }
    }, [invitation, navigate, token]);

    async function handleResponse(action) {
        try {
            setSubmitting(true);
            setError("");
            await respondToInvitation(token, action);
            localStorage.setItem("activeTeamId", String(invitation.team_id));
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err?.response?.data?.message || "Unable to process your response.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <Layout>
                <div className="text-center text-slate-600 text-lg py-16">Loading invitation…</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-4">Team Invitation</h1>

                {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
                )}

                {invitation ? (
                    <div className="space-y-6">
                        <div className="rounded-2xl bg-blue-50 p-5 border border-blue-100">
                            <p className="text-sm text-blue-700 uppercase tracking-wide font-semibold">Invitation Details</p>
                            <h2 className="mt-2 text-2xl font-semibold text-slate-800">{invitation.team_name}</h2>
                            <p className="text-slate-600 mt-2">
                                You have been invited to join <strong>{invitation.team_name}</strong> inside <strong>{invitation.organisation_name}</strong>.
                            </p>
                            <p className="text-slate-500 mt-2">Invite email: {invitation.email}</p>
                        </div>

                        <div className="flex gap-4 flex-wrap">
                            <button
                                onClick={() => handleResponse("accept")}
                                disabled={submitting}
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-60"
                            >
                                {submitting ? "Processing..." : "Accept Invitation"}
                            </button>

                            <button
                                onClick={() => handleResponse("decline")}
                                disabled={submitting}
                                className="bg-slate-200 text-slate-800 px-6 py-3 rounded-xl hover:bg-slate-300 disabled:opacity-60"
                            >
                                Decline Invitation
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-slate-600">Invitation not available.</div>
                )}
            </div>
        </Layout>
    );
}

export default Invite;
