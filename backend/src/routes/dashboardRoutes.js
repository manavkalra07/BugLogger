const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
    const authMiddleware = require("../middleware/authMiddleware");
    try{
        authMiddleware(req, res, () => {
            console.log("Authenticated user:", req.user);
        });
    }
    catch(error){
        console.error("Authentication error:", error);
        return res.status(500).json({
            error: "Authentication failed"
        });
    }

    return res.status(200).json({
        title: "Welcome to BugLogger",
        description: "BugLogger is a bug tracking system that helps teams report, manage, and track software issues efficiently."
    });
});

module.exports = router;