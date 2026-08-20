import axios from "./axios";

export async function getAllBugs() {
    const response = await axios.get("/bugs");
    return response.data;
}

export async function getBugById(id) {
    const response = await axios.get(`/bugs/${id}`);
    return response.data;
}

export async function createBug(data) {
    const response = await axios.post("/bugs", data);
    return response.data;
}

export async function updateBug(id, data) {
    const response = await axios.put(`/bugs/${id}`, data);
    return response.data;
}

export async function deleteBug(id) {
    const response = await axios.delete(`/bugs/${id}`);
    return response.data;
}

export async function assignBug(id, userId) {
    const response = await axios.patch(`/bugs/${id}/assign`, {
        userId,
    });

    return response.data;
}

export async function updateStatus(id, status) {
    const response = await axios.patch(`/bugs/${id}/status`, {
        status,
    });

    return response.data;
}

export async function getActivities(id) {
    const response = await axios.get(`/bugs/${id}/activities`);
    return response.data;
}