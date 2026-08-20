import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:5000/api",
});

instance.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");
    const activeTeamId = localStorage.getItem("activeTeamId");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (activeTeamId) {
        config.headers["x-team-id"] = activeTeamId;
    }

    return config;

});

export default instance;