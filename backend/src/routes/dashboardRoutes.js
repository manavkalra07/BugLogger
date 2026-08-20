const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const teamMiddleware = require("../middleware/teamMiddleware");
const { dashboardStats, recentBugs, assignedToMe } = require("../controllers/dashboardController");
const router = express.Router();

router.get(
    "/",
    authMiddleware,
    (req,res)=>{
        return res.status(200).json({
            title:"Welcome to BugLogger",
            description:"BugLogger Dashboard"
        });
    }
);


router.get(
    "/stats",
    authMiddleware,
    teamMiddleware,
    dashboardStats
);


router.get(
    "/recent",
    authMiddleware,
    teamMiddleware,
    recentBugs
);


router.get(
    "/assigned",
    authMiddleware,
    teamMiddleware,
    assignedToMe
);

module.exports = router;