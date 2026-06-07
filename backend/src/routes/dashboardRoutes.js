const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    return res.status(200).json({
        title: "Welcome to BugLogger",
        description: "BugLogger is a bug tracking system that helps teams report, manage, and track software issues efficiently."
    });
});

module.exports = router;