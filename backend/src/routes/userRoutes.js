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

async function findOrganisationByName(organisationName) {
    const [rows] = await db.query(
        "SELECT * FROM organisations WHERE organisation_name = ?",
        [organisationName]
    );

    return rows[0];
}

router.post("/", async (req, res) => {
    const { name, email, password, organisation_name } = req.body;

    try{
        
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

        // Create user using organisation ID from DB
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
});

module.exports = router;