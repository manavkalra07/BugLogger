const db = require("../config/db");
const bcrypt = require("bcrypt");

async function findUserById(userId) {
    const [rows] = await db.query(
        "SELECT id, name, email, organisation_id FROM users WHERE id = ?",
        [userId]
    );

    return rows[0];
}

async function createUser(name, email, password, orgId) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [rows] = await db.query(
        "INSERT INTO users (name, email, password, organisation_id) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, orgId]
    );

    return rows.insertId;
}

async function checkMailExists(email) {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows.length > 0;
}

async function findOrganisationByName(organisationName) {
    const [rows] = await db.query(
        "SELECT * FROM organisations WHERE organisation_name = ?",
        [organisationName]
    );

    return rows[0];
}

exports.createUser = async (req, res) => {
    const { name, email, password, organisation_name } = req.body;

    try {

        if (!name || !email || !password || !organisation_name) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const mailExists = await checkMailExists(email);

        if (mailExists) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        const organisation = await findOrganisationByName(
            organisation_name
        );

        if (!organisation) {
            return res.status(404).json({
                message: "Organization does not exist"
            });
        }

        const userId = await createUser(
            name,
            email,
            password,
            organisation.ID
        );

        return res.status(201).json({
            message: "User created successfully",
            userId
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });

    }
};

exports.getAllUsers = async (req, res) => {
    try {

        const userId = req.user.userId;
        const teamId = req.teamId || null;

        const [user] = await db.query(
            "SELECT organisation_id FROM users WHERE id=?",
            [userId]
        );

        const organisationId = user[0].organisation_id;

        const query = teamId
            ? `SELECT u.id, u.name
               FROM users u
               INNER JOIN team_members tm ON tm.user_id = u.id
               WHERE u.organisation_id=? AND tm.team_id=?`
            : `SELECT id, name
               FROM users
               WHERE organisation_id=?`;

        const params = teamId ? [organisationId, teamId] : [organisationId];

        const [users] = await db.query(query, params);

        return res.status(200).json(users);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });

    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await findUserById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateCurrentUser = async (req, res) => {
    const { name, email } = req.body;

    if (!name?.trim() || !email?.trim()) {
        return res.status(400).json({ message: "Name and email are required" });
    }

    try {
        const [existingUsers] = await db.query(
            "SELECT id FROM users WHERE email = ? AND id <> ?",
            [email.trim(), req.user.userId]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ message: "Email already exists" });
        }

        await db.query(
            "UPDATE users SET name = ?, email = ? WHERE id = ?",
            [name.trim(), email.trim(), req.user.userId]
        );

        return res.status(200).json({
            message: "Profile updated successfully",
            user: await findUserById(req.user.userId)
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new passwords are required" });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    try {
        const [rows] = await db.query(
            "SELECT password FROM users WHERE id = ?",
            [req.user.userId]
        );

        if (!rows[0] || !rows[0].password) {
            return res.status(400).json({ message: "Password changes are unavailable for this account" });
        }

        const matches = await bcrypt.compare(currentPassword, rows[0].password);

        if (!matches) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, req.user.userId]
        );

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};