import { useEffect, useState } from "react";
import { FiMail, FiSave, FiUser } from "react-icons/fi";
import Layout from "../components/layout/Layout";
import { getCurrentUser, updateCurrentUser } from "../api/userApi";

function Profile() {
    const [profile, setProfile] = useState({ name: "", email: "" });
    const [status, setStatus] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getCurrentUser()
            .then((user) => setProfile({ name: user.name || "", email: user.email || "" }))
            .catch(() => setStatus({ type: "error", message: "Unable to load your profile." }))
            .finally(() => setLoading(false));
    }, []);

    function handleChange(event) {
        setProfile({ ...profile, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSaving(true);
        setStatus({ type: "", message: "" });

        try {
            const data = await updateCurrentUser(profile);
            localStorage.setItem("name", data.user.name);
            localStorage.setItem("email", data.user.email);
            setProfile({ name: data.user.name, email: data.user.email });
            setStatus({ type: "success", message: data.message });
        } catch (error) {
            setStatus({ type: "error", message: error.response?.data?.message || "Unable to update your profile." });
        } finally {
            setSaving(false);
        }
    }

    return (
        <Layout>
            <div className="max-w-3xl space-y-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Account</p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">Your profile</h1>
                    <p className="mt-2 text-slate-500">Keep the details your team sees up to date.</p>
                </div>

                <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="mb-8 flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                            {(profile.name || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">Personal information</h2>
                            <p className="text-sm text-slate-500">This information is visible to your workspace.</p>
                        </div>
                    </div>

                    {status.message && <p className={`mb-6 rounded-lg px-4 py-3 text-sm ${status.type === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{status.message}</p>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <label className="block text-sm font-medium text-slate-700">
                            Full name
                            <span className="relative mt-2 block"><FiUser className="absolute left-3 top-3.5 text-slate-400" /><input name="name" value={profile.name} onChange={handleChange} disabled={loading || saving} className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-blue-500" required /></span>
                        </label>
                        <label className="block text-sm font-medium text-slate-700">
                            Email address
                            <span className="relative mt-2 block"><FiMail className="absolute left-3 top-3.5 text-slate-400" /><input type="email" name="email" value={profile.email} onChange={handleChange} disabled={loading || saving} className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-blue-500" required /></span>
                        </label>
                        <button type="submit" disabled={loading || saving} className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"><FiSave />{saving ? "Saving..." : "Save profile"}</button>
                    </form>
                </section>
            </div>
        </Layout>
    );
}

export default Profile;