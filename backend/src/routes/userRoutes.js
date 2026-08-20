const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const teamMiddleware = require("../middleware/teamMiddleware");

const {
    createUser,
    getAllUsers,
    getCurrentUser,
    updateCurrentUser,
    updatePassword
} = require("../controllers/userController");

router.post(
    "/",
    createUser
);

router.get(
    "/",
    authMiddleware,
    teamMiddleware,
    getAllUsers
);

router.get("/me", authMiddleware, getCurrentUser);
router.put("/me", authMiddleware, updateCurrentUser);
router.put("/me/password", authMiddleware, updatePassword);

module.exports = router;