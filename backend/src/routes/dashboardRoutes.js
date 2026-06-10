const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();


router.get("/", authMiddleware, (req, res) => {

    console.log("Authenticated user:", req.user);
    return res.status(200).json({
        title: "Welcome to BugLogger",
        description: "BugLogger is a bug tracking system that helps teams report, manage, and track software issues efficiently."
    });
});

module.exports = router;