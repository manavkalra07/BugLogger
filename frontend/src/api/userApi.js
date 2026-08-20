import axios from "./axios";

export async function getAllUsers() {
    const response = await axios.get("/users");
    return response.data;
}

export async function getCurrentUser() {
    const response = await axios.get("/users/me");
    return response.data;
}

export async function updateCurrentUser(user) {
    const response = await axios.put("/users/me", user);
    return response.data;
}

export async function updatePassword(passwords) {
    const response = await axios.put("/users/me/password", passwords);
    return response.data;
}
