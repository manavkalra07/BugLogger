const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const teamMiddleware = require("../middleware/teamMiddleware");

const {
    createTeam,
    getMyTeams,
    getTeamMembers,
    inviteTeamMember,
    getInvitationByToken,
    respondToInvitation
} = require("../controllers/teamController");

router.get(
    "/",
    authMiddleware,
    getMyTeams
);

router.post(
    "/",
    authMiddleware,
    createTeam
);

router.get(
    "/members",
    authMiddleware,
    teamMiddleware,
    getTeamMembers
);

router.post(
    "/invite",
    authMiddleware,
    teamMiddleware,
    inviteTeamMember
);

router.get(
    "/invitations/:token",
    getInvitationByToken
);

router.post(
    "/invitations/:token/respond",
    authMiddleware,
    respondToInvitation
);

module.exports = router;