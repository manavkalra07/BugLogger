const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const teamMiddleware = require("../middleware/teamMiddleware");
const upload = require("../services/upload");
const { createBug, getAllBugs, getBugById, updateBug, deleteBug, updateStatus, assignBug,addComment, getComments, getActivities, updateComment, deleteComment } = require("../controllers/bugController");


router.post(
    "/",
    authMiddleware,
    teamMiddleware,
    createBug,
);


router.get(
    "/",
    authMiddleware,
    teamMiddleware,
    getAllBugs
);


router.get(
    "/:id",
    authMiddleware,
    teamMiddleware,
    getBugById

);


router.put(
    "/:id",
    authMiddleware,
    teamMiddleware,
    updateBug
);


router.delete(
    "/:id",
    authMiddleware,
    teamMiddleware,
    deleteBug
);


router.patch(
    "/:id/status",
    authMiddleware,
    teamMiddleware,
    updateStatus
);


router.patch(
    "/:id/assign",
    authMiddleware,
    teamMiddleware,
    assignBug
);


router.post(
    "/:id/comments",
    authMiddleware,
    teamMiddleware,
    upload.array("media", 6),
    addComment
);


router.get(
    "/:id/comments",
    authMiddleware,
    teamMiddleware,
    getComments
);

router.put(
    "/:id/comments/:commentId",
    authMiddleware,
    teamMiddleware,
    updateComment
);

router.delete(
    "/:id/comments/:commentId",
    authMiddleware,
    teamMiddleware,
    deleteComment
);

router.get(
    "/:id/activities",
    authMiddleware,
    teamMiddleware,
    getActivities
);


module.exports = router;