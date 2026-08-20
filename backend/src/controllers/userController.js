const db = require("../config/db");
const bcrypt = require("bcrypt");

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