require("dotenv").config();
const app = require("./app");
const db = require("./config/db");
const PORT = process.env.PORT || 5000;

async function ensureCommentMediaColumn() {
    try {
        await db.query("ALTER TABLE comments ADD COLUMN media JSON NULL");
    } catch (error) {
        if (!error.message.includes("Duplicate column")) {
            throw error;
        }
    }
}

async function ensureTeamSchema() {
    try {
        await db.query(`CREATE TABLE IF NOT EXISTS teams (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            organisation_id INT NOT NULL,
            created_by INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_org_team (organisation_id),
            INDEX idx_team_created_by (created_by)
        )`);

        await db.query(`CREATE TABLE IF NOT EXISTS team_members (
            id INT AUTO_INCREMENT PRIMARY KEY,
            team_id INT NOT NULL,
            user_id INT NOT NULL,
            role ENUM('owner', 'admin', 'member') NOT NULL DEFAULT 'member',
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_team_member (team_id, user_id),
            INDEX idx_team_members_team (team_id),
            INDEX idx_team_members_user (user_id)
        )`);

        await db.query(`CREATE TABLE IF NOT EXISTS team_invitations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            team_id INT NOT NULL,
            email VARCHAR(255) NOT NULL,
            token VARCHAR(255) NOT NULL UNIQUE,
            invited_by INT NOT NULL,
            status ENUM('pending', 'accepted', 'declined', 'expired') NOT NULL DEFAULT 'pending',
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_team_invites_team (team_id),
            INDEX idx_team_invites_email (email)
        )`);

        await db.query(`ALTER TABLE bugs ADD COLUMN team_id INT NULL AFTER organisation_id`);
    } catch (error) {
        if (!error.message.includes("Duplicate column") && !error.message.includes("already exists")) {
            throw error;
        }
    }
}

async function startServer() {
    try {
        const connection = await db.getConnection();

        console.log("Connected to the database");

        await ensureCommentMediaColumn();
        await ensureTeamSchema();

        connection.release();

        app.listen(PORT, () => {
            console.log("Server is running on port " + PORT);
        });

    } catch (error) {
        console.log("Error connecting to the database");
        console.error(error);

        process.exit(1);
    }
}

startServer();