const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const teamMiddleware = require("../middleware/teamMiddleware");

const {
    createUser,
    getAllUsers
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

module.exports = router;