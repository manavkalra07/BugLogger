import { useState } from "react";
import { X } from "lucide-react";

function CreateBugModal({ isOpen, onClose, onBugCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [reproduceSteps, setReproduceSteps] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    async function handleSubmit(e) {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            alert("Please fill all required fields.");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:5000/api/bugs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    reproduce_steps: reproduceSteps,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to create bug.");
                return;
            }

            setTitle("");
            setDescription("");
            setReproduceSteps("");

            onBugCreated();
        } catch (error) {
            alert("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                        Create New Bug
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-gray-100"
                    >
                        <X size={22} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block font-medium">
                            Title
                        </label>

                        <input
                            type="text"
                            placeholder="Enter bug title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Description
                        </label>

                        <textarea
                            rows="4"
                            placeholder="Describe the bug"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Steps to Reproduce
                        </label>

                        <textarea
                            rows="4"
                            placeholder="1. Open the page&#10;2. Click the button&#10;3. Observe the issue"
                            value={reproduceSteps}
                            onChange={(e) => setReproduceSteps(e.target.value)}
                            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border px-5 py-2"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Bug"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateBugModal;