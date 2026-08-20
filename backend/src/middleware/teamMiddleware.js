const db = require("../config/db");

async function ensureTeamAccess(req, res, next) {
    try {
        const teamId = req.headers["x-team-id"];

        if (!teamId) {
            return next();
        }

        const [membership] = await db.query(
            `SELECT tm.team_id, tm.role, t.name AS team_name, t.organisation_id
             FROM team_members tm
             INNER JOIN teams t ON t.id = tm.team_id
             WHERE tm.user_id = ? AND tm.team_id = ?`,
            [req.user.userId, teamId]
        );

        if (!membership.length) {
            return res.status(403).json({
                message: "You do not have access to the selected team"
            });
        }

        req.teamId = Number(teamId);
        req.team = membership[0];
        req.organisationId = membership[0].organisation_id;

        return next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = ensureTeamAccess;
