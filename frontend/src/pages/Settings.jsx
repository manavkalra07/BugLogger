import { useState } from "react";
import { FiLock, FiSave } from "react-icons/fi";
import Layout from "../components/layout/Layout";
import { updatePassword } from "../api/userApi";

function Settings() {
    const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [status, setStatus] = useState({ type: "", message: "" });
    const [saving, setSaving] = useState(false);

    function handleChange(event) {
        setPasswords({ ...passwords, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setStatus({ type: "", message: "" });

        if (passwords.newPassword !== passwords.confirmPassword) {
            setStatus({ type: "error", message: "New passwords do not match." });
            return;
        }

        setSaving(true);
        try {
            const data = await updatePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setStatus({ type: "success", message: data.message });
        } catch (error) {
            setStatus({ type: "error", message: error.response?.data?.message || "Unable to update your password." });
        } finally {
            setSaving(false);
        }
    }

    return (
        <Layout>
            <div className="max-w-3xl space-y-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Workspace</p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">Settings</h1>
                    <p className="mt-2 text-slate-500">Manage your sign-in security.</p>
                </div>
                <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="mb-8 flex items-center gap-4"><div className="rounded-xl bg-blue-50 p-3 text-blue-600"><FiLock size={24} /></div><div><h2 className="text-xl font-semibold text-slate-900">Change password</h2><p className="text-sm text-slate-500">Use a strong password with at least 8 characters.</p></div></div>
                    {status.message && <p className={`mb-6 rounded-lg px-4 py-3 text-sm ${status.type === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{status.message}</p>}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {[["currentPassword", "Current password"], ["newPassword", "New password"], ["confirmPassword", "Confirm new password"]].map(([name, label]) => <label key={name} className="block text-sm font-medium text-slate-700">{label}<input type="password" name={name} value={passwords[name]} onChange={handleChange} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" minLength={name === "currentPassword" ? undefined : 8} required /></label>)}
                        <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"><FiSave />{saving ? "Updating..." : "Update password"}</button>
                    </form>
                </section>
            </div>
        </Layout>
    );
}

export default Settings;