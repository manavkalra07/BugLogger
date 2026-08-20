import axios from "./axios";

export async function getAllUsers() {
    const response = await axios.get("/users");
    return response.data;
}
