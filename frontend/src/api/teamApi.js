import axios from "./axios";

export async function getMyTeams() {
    const response = await axios.get("/team");
    return response.data;
}

export async function createTeam(payload) {
    const response = await axios.post("/team", payload);
    return response.data;
}

export async function inviteTeamMember(payload) {
    const response = await axios.post("/team/invite", payload);
    return response.data;
}

export async function getTeamMembers(teamId) {
    const response = await axios.get(`/team/members?teamId=${teamId}`);
    return response.data;
}

export async function getInvitationByToken(token) {
    const response = await axios.get(`/team/invitations/${token}`);
    return response.data;
}

export async function respondToInvitation(token, action) {
    const response = await axios.post(`/team/invitations/${token}/respond`, { action });
    return response.data;
}
