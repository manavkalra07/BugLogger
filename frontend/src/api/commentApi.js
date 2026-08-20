import axios from "./axios";

export async function getCommentsByBugId(bugId) {
    const response = await axios.get(`/bugs/${bugId}/comments`);
    return response.data;
}

export async function addComment(bugId, comment, files = []) {
    const formData = new FormData();
    formData.append("comment", comment);

    files.forEach((file) => {
        formData.append("media", file);
    });

    const response = await axios.post(`/bugs/${bugId}/comments`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
}

export async function updateComment(bugId, commentId, comment) {
    const response = await axios.put(`/bugs/${bugId}/comments/${commentId}`, { comment });
    return response.data;
}

export async function deleteComment(bugId, commentId) {
    const response = await axios.delete(`/bugs/${bugId}/comments/${commentId}`);
    return response.data;
}
