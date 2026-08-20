import { useEffect, useState } from "react";
import { addComment, getCommentsByBugId } from "../../api/commentApi";
import CommentCard from "./CommentCard";

const allowedImageTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif", "image/webp"];
const allowedVideoTypes = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"];

function CommentsSection({ bugId }) {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    async function fetchComments() {
        try {
            setLoading(true);
            const data = await getCommentsByBugId(bugId);
            setComments(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchComments();
    }, [bugId]);

    function handleFileSelection(event) {
        const files = Array.from(event.target.files || []);
        const invalidFiles = files.filter((file) => {
            const type = file.type.toLowerCase();
            return !allowedImageTypes.includes(type) && !allowedVideoTypes.includes(type);
        });

        if (invalidFiles.length > 0) {
            alert("Only images (png, jpg, jpeg, gif, webp) and videos (mp4, mov, avi, webm) are allowed.");
            return;
        }

        const nextFiles = [...selectedFiles, ...files].slice(0, 6);
        setSelectedFiles(nextFiles);
        setPreviewUrls(nextFiles.map((file) => URL.createObjectURL(file)));
    }

    function removeFile(index) {
        const nextFiles = selectedFiles.filter((_, itemIndex) => itemIndex !== index);
        const nextPreviews = previewUrls.filter((_, itemIndex) => itemIndex !== index);
        setSelectedFiles(nextFiles);
        setPreviewUrls(nextPreviews);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!commentText.trim() && selectedFiles.length === 0) {
            alert("Please enter a comment or select media");
            return;
        }

        try {
            setSubmitting(true);
            const response = await addComment(bugId, commentText.trim(), selectedFiles);
            setCommentText("");
            setSelectedFiles([]);
            setPreviewUrls([]);

            if (response.uploadErrors && response.uploadErrors.length > 0) {
                alert(`Comment posted, but some files failed to upload:\n${response.uploadErrors.join("\n")}`);
            }

            await fetchComments();
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to add comment";
            const errors = error?.response?.data?.errors;

            if (errors && errors.length > 0) {
                alert(`${errorMessage}\n\n${errors.join("\n")}`);
            } else {
                alert(errorMessage);
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Comments</h2>
                <span className="text-sm text-slate-500">{comments.length} total</span>
            </div>

            <form onSubmit={handleSubmit} className="mb-6">
                <textarea
                    rows="4"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="mt-3">
                    <label className="inline-flex items-center px-4 py-2 border rounded-lg cursor-pointer bg-white text-sm text-slate-700">
                        <input type="file" multiple accept="image/png,image/jpg,image/jpeg,image/gif,image/webp,video/mp4,video/quicktime,video/x-msvideo,video/webm" onChange={handleFileSelection} className="hidden" />
                        Upload media
                    </label>
                </div>

                {previewUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                        {previewUrls.map((preview, index) => {
                            const file = selectedFiles[index];
                            const isVideo = file?.type?.startsWith("video/");

                            return (
                                <div key={`${preview}-${index}`} className="relative border rounded-xl overflow-hidden bg-slate-50">
                                    {isVideo ? (
                                        <video src={preview} controls className="w-full h-40 object-cover" />
                                    ) : (
                                        <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="absolute top-2 right-2 bg-black/70 text-white rounded-full px-2 py-1 text-xs"
                                    >
                                        Remove
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="mt-3 flex justify-end">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg disabled:opacity-50"
                    >
                        {submitting ? "Posting..." : "Post Comment"}
                    </button>
                </div>
            </form>

            {loading ? (
                <div className="text-slate-500">Loading comments...</div>
            ) : comments.length === 0 ? (
                <div className="border rounded-xl p-6 text-center text-slate-500 bg-slate-50">
                    No comments yet. Start the conversation.
                </div>
            ) : (
                <div className="space-y-3">
                    {comments.map((comment) => (
                        <CommentCard
                            key={comment.id}
                            comment={comment}
                            bugId={bugId}
                            onCommentUpdated={fetchComments}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default CommentsSection;
