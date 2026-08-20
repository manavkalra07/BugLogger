import { useState } from "react";
import { deleteComment, updateComment } from "../../api/commentApi";

function CommentCard({ comment, bugId, onCommentUpdated }) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(comment.comment || "");
    const [loading, setLoading] = useState(false);

    async function handleSave() {
        if (!draft.trim()) {
            alert("Comment cannot be empty");
            return;
        }

        try {
            setLoading(true);
            await updateComment(bugId, comment.id, draft.trim());
            setIsEditing(false);
            onCommentUpdated();
        } catch (error) {
            alert(error?.response?.data?.message || "Failed to update comment");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        const confirmed = window.confirm("Delete this comment?");

        if (!confirmed) return;

        try {
            setLoading(true);
            await deleteComment(bugId, comment.id);
            onCommentUpdated();
        } catch (error) {
            alert(error?.response?.data?.message || "Failed to delete comment");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="border rounded-xl p-4 bg-slate-50">
            <div className="flex justify-between items-start gap-3">
                <div>
                    <div className="font-semibold text-slate-800">{comment.name}</div>
                    <div className="text-sm text-slate-500 mt-1">
                        {new Date(comment.created_at).toLocaleString()}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {comment.media && comment.media.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                    {comment.media.map((item, index) => (
                        <div key={`${item.url}-${index}`} className="border rounded-xl overflow-hidden bg-white">
                            {item.type === "video" ? (
                                <video src={item.url} controls className="w-full h-40 object-cover" />
                            ) : (
                                <img src={item.url} alt="Comment media" className="w-full h-40 object-cover" />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {isEditing ? (
                <div className="mt-3 space-y-3">
                    <textarea
                        rows="3"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        className="w-full border rounded-lg p-3"
                    />
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setDraft(comment.comment || "");
                            }}
                            className="border px-4 py-2 rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <p className="mt-3 text-slate-700 leading-7">{comment.comment}</p>
            )}
        </div>
    );
}

export default CommentCard;
