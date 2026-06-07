const db = require("../config/db");
const express = require("express");
const router = express.Router();
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

async function checkOrganisationExists(orgId) {
    const [rows] = await db.query(
        "SELECT * FROM organisations WHERE ID = ?",
        [orgId]
    );

    return rows.length > 0;
}

router.post("/", async (req, res) => {
    const { name, email, password, organisation_id } = req.body;

    try {
        // Validate required fields
        if (!name || !email || !password || !organisation_id) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check email uniqueness
        const mailExists = await checkMailExists(email);

        if (mailExists) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        // Check organization exists
        const orgExists = await checkOrganisationExists(organisation_id);

        if (!orgExists) {
            return res.status(404).json({
                message: "Organization does not exist"
            });
        }

        // Create user
        const userId = await createUser(
            name,
            email,
            password,
            organisation_id
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
});

module.exports = router;