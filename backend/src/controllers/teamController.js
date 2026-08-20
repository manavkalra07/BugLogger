const crypto = require("crypto");
const db = require("../config/db");
const sendEmail = require("../services/emailService");

exports.createTeam = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.userId;

        if (!name) {
            return res.status(400).json({
                message: "Team name is required"
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

        const [teamResult] = await db.query(
            `INSERT INTO teams
            (
                name,
                organisation_id,
                created_by
            )
            VALUES (?,?,?)`,
            [name, organisationId, userId]
        );

        const teamId = teamResult.insertId;

        await db.query(
            `INSERT INTO team_members
            (
                team_id,
                user_id,
                role
            )
            VALUES (?,?,?)`,
            [teamId, userId, "owner"]
        );

        return res.status(201).json({
            message: "Team created successfully",
            teamId
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

exports.getMyTeams = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [teams] = await db.query(
            `SELECT t.id, t.name, tm.role
             FROM teams t
             INNER JOIN team_members tm ON tm.team_id = t.id
             INNER JOIN users u ON u.id = ?
             WHERE tm.user_id = ? AND t.organisation_id = u.organisation_id
             ORDER BY t.name ASC`,
            [userId, userId]
        );

        return res.status(200).json({
            teams
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

exports.getTeamMembers = async (req, res) => {
    try {
        const teamId = Number(req.query.teamId || req.teamId);

        if (!teamId) {
            return res.status(400).json({
                message: "Team id is required"
            });
        }

        const [members] = await db.query(
            `SELECT u.id, u.name, u.email, tm.role, tm.joined_at
             FROM team_members tm
             INNER JOIN users u ON u.id = tm.user_id
             WHERE tm.team_id = ?
             ORDER BY u.name ASC`,
            [teamId]
        );

        return res.status(200).json(members);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

exports.inviteTeamMember = async (req, res) => {
    try {
        const { team_id, email } = req.body;
        const invitedBy = req.user.userId;

        if (!team_id || !email) {
            return res.status(400).json({
                message: "Team id and email are required"
            });
        }

        const [membership] = await db.query(
            `SELECT tm.role, t.organisation_id
             FROM team_members tm
             INNER JOIN teams t ON t.id = tm.team_id
             WHERE tm.user_id = ? AND tm.team_id = ?`,
            [invitedBy, team_id]
        );

        if (!membership.length || !["owner", "admin"].includes(membership[0].role)) {
            return res.status(403).json({
                message: "Only team owners and admins can invite members"
            });
        }

        const [existingMembership] = await db.query(
            `SELECT id FROM team_members WHERE team_id = ? AND user_id = (
                SELECT id FROM users WHERE email = ? LIMIT 1
            )`,
            [team_id, email.toLowerCase()]
        );

        if (existingMembership.length) {
            return res.status(409).json({
                message: "This user is already a member of the team"
            });
        }

        const [pendingInvitation] = await db.query(
            `SELECT id FROM team_invitations
             WHERE team_id = ? AND email = ? AND status = 'pending' AND expires_at > NOW()`,
            [team_id, email.toLowerCase()]
        );

        if (pendingInvitation.length) {
            return res.status(409).json({
                message: "A pending invitation for this email already exists"
            });
        }

        const [team] = await db.query(
            `SELECT t.id, t.name, o.organisation_name
             FROM teams t
             INNER JOIN organisations o ON o.id = t.organisation_id
             WHERE t.id = ?`,
            [team_id]
        );

        if (!team.length) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await db.query(
            `INSERT INTO team_invitations
            (team_id, email, token, invited_by, status, expires_at)
            VALUES (?, ?, ?, ?, 'pending', ?)`,
            [team_id, email.toLowerCase(), token, invitedBy, expiresAt]
        );

        const inviteLink = `${process.env.APP_URL || "http://localhost:5173"}/invite/${token}`;

        await sendEmail(
            email,
            `Invitation to join ${team[0].name}`,
            `You have been invited to join ${team[0].name} inside ${team[0].organisation_name}.\n\nAccept Invitation\n${inviteLink}`
        );

        return res.status(201).json({
            message: "Invitation sent successfully",
            inviteLink
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

exports.getInvitationByToken = async (req, res) => {
    try {
        const { token } = req.params;

        const [invitation] = await db.query(
            `SELECT ti.id, ti.team_id, ti.email, ti.token, ti.status, ti.expires_at,
                    t.name AS team_name,
                    o.organisation_name
             FROM team_invitations ti
             INNER JOIN teams t ON t.id = ti.team_id
             INNER JOIN organisations o ON o.id = t.organisation_id
             WHERE ti.token = ?`,
            [token]
        );

        if (!invitation.length) {
            return res.status(404).json({
                message: "Invitation not found"
            });
        }

        if (new Date(invitation[0].expires_at) < new Date()) {
            return res.status(410).json({
                message: "Invitation expired"
            });
        }

        return res.status(200).json(invitation[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

exports.respondToInvitation = async (req, res) => {
    try {
        const { token } = req.params;
        const { action } = req.body;
        const userId = req.user.userId;

        if (!["accept", "decline"].includes(action)) {
            return res.status(400).json({
                message: "Action must be accept or decline"
            });
        }

        const [invitationRows] = await db.query(
            `SELECT ti.*, t.organisation_id
             FROM team_invitations ti
             INNER JOIN teams t ON t.id = ti.team_id
             WHERE ti.token = ?`,
            [token]
        );

        if (!invitationRows.length) {
            return res.status(404).json({
                message: "Invitation not found"
            });
        }

        const invitation = invitationRows[0];

        if (invitation.status !== "pending") {
            return res.status(409).json({
                message: `Invitation has already been ${invitation.status}`
            });
        }

        if (new Date(invitation.expires_at) < new Date()) {
            return res.status(410).json({
                message: "Invitation expired"
            });
        }

        if (action === "decline") {
            await db.query(
                `UPDATE team_invitations
                 SET status = 'declined'
                 WHERE id = ?`,
                [invitation.id]
            );

            return res.status(200).json({
                message: "Invitation declined"
            });
        }

        const [userRow] = await db.query(
            `SELECT id, organisation_id, email FROM users WHERE id = ?`,
            [userId]
        );

        if (!userRow.length) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const userEmail = userRow[0].email.toLowerCase();

        if (userEmail !== invitation.email.toLowerCase()) {
            return res.status(403).json({
                message: "This invitation is for a different user"
            });
        }

        const [existingMembership] = await db.query(
            `SELECT id FROM team_members WHERE team_id = ? AND user_id = ?`,
            [invitation.team_id, userId]
        );

        if (!existingMembership.length) {
            await db.query(
                `INSERT INTO team_members (team_id, user_id, role)
                 VALUES (?, ?, 'member')`,
                [invitation.team_id, userId]
            );
        }

        await db.query(
            `UPDATE team_invitations
             SET status = 'accepted'
             WHERE id = ?`,
            [invitation.id]
        );

        return res.status(200).json({
            message: "Invitation accepted"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};