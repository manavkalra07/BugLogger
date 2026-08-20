import { useState } from "react";
import { updateStatus } from "../../api/bugApi";

function StatusDropdown({ bug, onStatusUpdated }) {
    const [status, setStatus] = useState(bug.status);
    const [loading, setLoading] = useState(false);

    async function handleUpdate() {
        try {
            setLoading(true);

            await updateStatus(bug.id, status);

            onStatusUpdated();

        } catch (error) {
            console.log(error);
            alert("Failed to update status");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mt-10">

            <h2 className="text-xl font-semibold mb-3">
                Status
            </h2>

            <div className="bg-slate-50 border rounded-xl p-4 flex gap-4">

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="flex-1 border rounded-lg p-3"
                >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                    <option>Closed</option>
                </select>

                <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg disabled:opacity-50"
                >
                    {loading ? "Updating..." : "Update"}
                </button>

            </div>

        </div>
    );
}

export default StatusDropdown;