const db = require("../config/db");
const { uploadToCloudinary, deleteFromCloudinary } = require("../services/cloudinaryService");

exports.createBug = async (req, res) => {

    try {

        const { title, description, reproduce_steps } = req.body;

        const userId = req.user.userId;
        const teamId = req.teamId || null;

        if (!title || !description) {

            return res.status(400).json({
                message: "Title and Description are required"
            });

        }

        const [user] = await db.query(

            "SELECT organisation_id FROM users WHERE id=?",

            [userId]
        );

        if (user.length === 0) {
            return res.status(404).json({

                message: "User not found"
            });
        }

        const organisationId = user[0].organisation_id;

        const [result] = await db.query(
            `INSERT INTO bugs
            (
                title,
                description,
                reproduce_steps,
                created_by,
                organisation_id,
                team_id
            )
            VALUES(?,?,?,?,?,?)`,
            [
                title,
                description,
                reproduce_steps,
                userId,
                organisationId,
                teamId
            ]
        );

        await logActivity(
            result.insertId,
            userId,
            "Create Bug"
        );

        return res.status(201).json({
            message: "Bug created successfully",
            bugId: result.insertId
        });

    }
    catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });

    }

};

exports.getAllBugs = async(req, res)=>{
    try{
        const userId = req.user.userId;
        const teamId = req.teamId || null;
        const[user] = await db.query(
            "SELECT organisation_id FROM users WHERE id =?",
            [userId]
        );
        const organisationId = user[0].organisation_id;
        const query = teamId
            ? `SELECT * FROM bugs WHERE organisation_id = ? AND team_id = ?`
            : `SELECT * FROM bugs WHERE organisation_id = ?`;
        const params = teamId ? [organisationId, teamId] : [organisationId];
        const [bugs] = await db.query(query, params);
        return res.status(200).json(
            bugs
        );
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            message:"Internal server error"
        });
    }
}

exports.getBugById = async (req, res) => {

    try {

        const bugId = req.params.id;

        const [bug] = await db.query(
            `SELECT
                bugs.*,
                users.name AS assigned_user
            FROM bugs
            LEFT JOIN users
            ON bugs.assigned_to = users.id
            WHERE bugs.id = ?`,
            [bugId]
        );

        if (bug.length === 0) {
            return res.status(404).json({
                message: "Bug not found"
            });
        }

        return res.status(200).json(
            bug[0]
        );

    }
    catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });

    }

}

exports.updateBug = async (req, res) => {

    try {
        const bugId = req.params.id;
        const { title, description } = req.body;
        const [bug] = await db.query(
            "SELECT * FROM bugs WHERE id=?",
            [bugId]
        );
        if (bug.length === 0) {
            return res.status(404).json({
                message: "Bug not found"
            });
        }
        await db.query(
            `UPDATE bugs
            SET title=?,
            description=?
            WHERE id=?`,
            [
                title,
                description,
                bugId
            ]
        );
        await logActivity(
            bugId,
            req.user.userId,
            "Updated Bug"
        );
        return res.status(200).json({
            message: "Bug updated successfully"
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            message:"Internal server error"
        });
    }
}

exports.deleteBug = async (req, res) => {
    try {
        const bugId = req.params.id;

        const [bug] = await db.query(
            "SELECT * FROM bugs WHERE id=?",
            [bugId]
        );

        if (bug.length === 0) {
            return res.status(404).json({
                message: "Bug not found"
            });
        }

        await db.query(
            "DELETE FROM comments WHERE bug_id=?",
            [bugId]
        );

        await db.query(
            "DELETE FROM activity_logs WHERE bug_id=?",
            [bugId]
        );

        await db.query(
            "DELETE FROM bugs WHERE id=?",
            [bugId]
        );

        return res.status(200).json({
            message: "Bug deleted successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
exports.updateStatus = async (req, res) => {
    try {
        const bugId = req.params.id;
        const { status } = req.body;
        const [bug] = await db.query(
            "SELECT * FROM bugs WHERE id=?",
            [bugId]
        );
        if (bug.length === 0) {
            return res.status(404).json({
                message: "Bug not found"
            });
        }
        await db.query(
            `UPDATE bugs
            SET status=?
            WHERE id=?`,
            [
                status,
                bugId
            ]
        );
        await logActivity(
            bugId,
            req.user.userId,
            `Changed Status to ${status}`
        );
        return res.status(200).json({
            message: "Status updated successfully"
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            message:"Internal server error"
        });
    }
}
async function logActivity(bugId, userId, action) {
    await db.query(
        `INSERT INTO activity_logs
        (bug_id,user_id,action)
        VALUES(?,?,?)`,
        [
            bugId,
            userId,
            action
        ]
    );
}
exports.assignBug = async (req, res) => {
    try {

        const bugId = req.params.id;
        const { userId } = req.body;

        const [bug] = await db.query(
            "SELECT * FROM bugs WHERE id=?",
            [bugId]
        );

        if (bug.length === 0) {
            return res.status(404).json({
                message: "Bug not found"
            });
        }

        const [user] = await db.query(
            "SELECT id, name FROM users WHERE id=?",
            [userId]
        );

        if (user.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await db.query(
            "UPDATE bugs SET assigned_to=? WHERE id=?",
            [
                userId,
                bugId
            ]
        );

        await logActivity(
            bugId,
            req.user.userId,
            `Assigned bug to ${user[0].name}`
        );

        return res.status(200).json({
            message: "Bug assigned successfully",
            assignedUser: user[0]
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });

    }
};
exports.addComment = async (req, res) => {
    try {
        const bugId = req.params.id;
        const { comment } = req.body;
        const userId = req.user.userId;

        if (!comment && (!req.files || req.files.length === 0)) {
            return res.status(400).json({
                message: "Comment or media required"
            });
        }

        let uploadedMedia = [];
        let uploadErrors = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                try {
                    const uploaded = await uploadToCloudinary(file.buffer, file.mimetype);
                    uploadedMedia.push({
                        url: uploaded.secure_url,
                        type: uploaded.resource_type === "video" ? "video" : "image",
                        publicId: uploaded.public_id,
                    });
                } catch (uploadError) {
                    console.error("Failed to upload file:", uploadError.message);
                    uploadErrors.push(`Failed to upload ${file.originalname}: ${uploadError.message}`);
                }
            }

            if (uploadErrors.length > 0 && uploadedMedia.length === 0) {
                return res.status(400).json({
                    message: "All media uploads failed. Please check file size and format.",
                    errors: uploadErrors
                });
            }
        }

        const [result] = await db.query(
            `INSERT INTO comments
            (
            bug_id,
            user_id,
            comment,
            media
            )
            VALUES(?,?,?,?)`,
            [
                bugId,
                userId,
                comment || "",
                JSON.stringify(uploadedMedia)
            ]
        );

        await logActivity(
            bugId,
            userId,
            "Added Comment"
        );

        return res.status(201).json({
            message: "Comment added",
            commentId: result.insertId,
            media: uploadedMedia,
            uploadErrors: uploadErrors.length > 0 ? uploadErrors : undefined
        });
    }
    catch (error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({
            message: error.message || "Internal server error"
        });
    }
}
exports.getComments = async (req, res) => {
    try {
        const bugId = req.params.id;
        const [comments] = await db.query(
            `SELECT
            comments.*,
            users.name
            FROM comments
            JOIN users
            ON users.id=comments.user_id
            WHERE comments.bug_id=?
            ORDER BY created_at DESC`,
            [bugId]
        );

        return res.status(200).json(
            comments.map((comment) => {
                let media = [];
                try {
                    if (comment.media) {
                        media = typeof comment.media === "string" ? JSON.parse(comment.media) : comment.media;
                    }
                } catch (parseError) {
                    console.error("Error parsing media JSON:", parseError);
                    media = [];
                }

                return {
                    ...comment,
                    media,
                };
            })
        );
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

exports.updateComment = async (req, res) => {
    try {
        const bugId = req.params.id;
        const commentId = req.params.commentId;
        const { comment } = req.body;
        const userId = req.user.userId;

        if (!comment) {
            return res.status(400).json({ message: "Comment required" });
        }

        const [existingComment] = await db.query(
            "SELECT * FROM comments WHERE id=? AND bug_id=?",
            [commentId, bugId]
        );

        if (existingComment.length === 0) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (existingComment[0].user_id !== userId) {
            return res.status(403).json({ message: "Not authorized to edit this comment" });
        }

        await db.query(
            "UPDATE comments SET comment=? WHERE id=? AND bug_id=?",
            [comment, commentId, bugId]
        );

        await logActivity(bugId, userId, "Updated Comment");

        return res.status(200).json({ message: "Comment updated" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const bugId = req.params.id;
        const commentId = req.params.commentId;
        const userId = req.user.userId;

        const [existingComment] = await db.query(
            "SELECT * FROM comments WHERE id=? AND bug_id=?",
            [commentId, bugId]
        );

        if (existingComment.length === 0) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (existingComment[0].user_id !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }

        const media = [];
        try {
            if (existingComment[0].media) {
                const parsed = typeof existingComment[0].media === "string" 
                    ? JSON.parse(existingComment[0].media) 
                    : existingComment[0].media;
                media.push(...parsed);
            }
        } catch (parseError) {
            console.error("Error parsing media JSON in deleteComment:", parseError);
        }

        await Promise.all(
            media.map((item) => deleteFromCloudinary(item.publicId))
        );

        await db.query(
            "DELETE FROM comments WHERE id=? AND bug_id=?",
            [commentId, bugId]
        );

        await logActivity(bugId, userId, "Deleted Comment");

        return res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getActivities = async (req, res) => {
    try {
        const bugId = req.params.id;
        const [activities] = await db.query(
            `SELECT
            activity_logs.*,
            users.name
            FROM activity_logs
            JOIN users
            ON users.id=activity_logs.user_id
            WHERE activity_logs.bug_id=?
            ORDER BY created_at DESC`,
            [bugId]
        );
        return res.status(200).json(
            activities
        );
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
