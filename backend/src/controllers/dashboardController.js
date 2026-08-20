const db = require("../config/db");


exports.dashboardStats = async (req, res) => {

    try {
        const userId = req.user.userId;
        const teamId = req.teamId || null;
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
        const teamFilter = teamId ? "AND COALESCE(team_id, 0) = ?" : "";
        const teamValue = teamId ? [organisationId, teamId] : [organisationId];

        const [total] = await db.query(
            `SELECT COUNT(*) AS total
            FROM bugs
            WHERE organisation_id=? ${teamFilter}`,
            teamValue
        );
        const [open] = await db.query(
            `SELECT COUNT(*) AS total
            FROM bugs
            WHERE organisation_id=? ${teamFilter} AND status='Open'`,
            teamValue

        );
        const [inProgress] = await db.query(
            `SELECT COUNT(*) AS total
            FROM bugs
            WHERE organisation_id=? ${teamFilter} AND status='In Progress'`,
            teamValue
        );
        const [resolved] = await db.query(
            `SELECT COUNT(*) AS total
            FROM bugs
            WHERE organisation_id=? ${teamFilter} AND status='Resolved'`,
            teamValue
        );
        const [closed] = await db.query(
            `SELECT COUNT(*) AS total
            FROM bugs
            WHERE organisation_id=? ${teamFilter} AND status='Closed'`,
            teamValue
        );
        return res.status(200).json({
            totalBugs: total[0].total,
            open: open[0].total,
            inProgress: inProgress[0].total,
            resolved: resolved[0].total,
            closed: closed[0].total
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            message:"Internal server error"
        });
    }
};



exports.recentBugs = async (req,res)=>{
    try{
        const userId = req.user.userId;
        const teamId = req.teamId || null;
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
        const query = teamId
            ? `SELECT * FROM bugs WHERE organisation_id=? AND team_id=? ORDER BY updated_at DESC LIMIT 5`
            : `SELECT * FROM bugs WHERE organisation_id=? ORDER BY updated_at DESC LIMIT 5`;
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
};


exports.assignedToMe = async(req,res)=>{
    try{
        const userId=req.user.userId;
        const teamId = req.teamId || null;
        const query = teamId
            ? `SELECT * FROM bugs WHERE assigned_to=? AND team_id=?`
            : `SELECT * FROM bugs WHERE assigned_to=?`;
        const params = teamId ? [userId, teamId] : [userId];
        const [bugs]=await db.query(query, params);
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
};