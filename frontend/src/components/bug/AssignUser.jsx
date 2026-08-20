import { useState } from "react";
import { assignBug } from "../../api/bugApi";

function AssignUser({ bug, users, onAssigned }) {
    const [selectedUser, setSelectedUser] = useState("");
    const [assignLoading, setAssignLoading] = useState(false);

    async function handleAssign() {
        if (!selectedUser) {
            alert("Please select a user.");
            return;
        }

        try {
            setAssignLoading(true);
            await assignBug(bug.id, Number(selectedUser));
            setSelectedUser("");
            onAssigned();
            alert("Bug assigned successfully");
        } catch (error) {
            alert(error?.response?.data?.message || "Something went wrong");
        } finally {
            setAssignLoading(false);
        }
    }

    return (
        <div className="mt-10">
            <h2 className="text-xl font-semibold mb-3">
                Assigned To
            </h2>

            <div className="bg-slate-50 border rounded-xl p-4">
                <p className="text-slate-700 font-medium mb-4">
                    {bug.assigned_user || "Not Assigned"}
                </p>

                <div className="flex gap-4">
                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="flex-1 border rounded-lg p-3"
                    >
                        <option value="">Select User</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleAssign}
                        disabled={assignLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg disabled:opacity-50"
                    >
                        {assignLoading ? "Assigning..." : "Assign"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AssignUser;
