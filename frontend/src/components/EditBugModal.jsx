import { useEffect, useState } from "react";
import { X } from "lucide-react";

function EditBugModal({ isOpen, onClose, bug, onBugUpdated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [reproduceSteps, setReproduceSteps] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (bug) {
            setTitle(bug.title || "");
            setDescription(bug.description || "");
            setReproduceSteps(bug.reproduce_steps || "");
        }
    }, [bug]);

    if (!isOpen || !bug) return null;

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/bugs/${bug.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        reproduce_steps: reproduceSteps,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            onBugUpdated();
        } catch (error) {
            alert("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6">

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold">
                        Edit Bug
                    </h2>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <X size={22} />
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded-lg p-3"
                    />

                    <textarea
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded-lg p-3"
                    />

                    <textarea
                        rows="4"
                        value={reproduceSteps}
                        onChange={(e) => setReproduceSteps(e.target.value)}
                        className="w-full border rounded-lg p-3"
                    />

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="border rounded-lg px-5 py-2"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white rounded-lg px-5 py-2"
                        >
                            {loading ? "Updating..." : "Update Bug"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default EditBugModal;