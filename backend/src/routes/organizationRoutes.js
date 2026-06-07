const db = require("../config/db");
const express = require("express");
const router = express.Router();

async function createOrganization(orgname) {
    const [rows] = await db.query(
        "INSERT INTO organisations (organisation_name) VALUES (?)",
        [orgname]
    );

    return rows.insertId;
}
async function checkOrganizationExists(orgname) {
    const [rows] = await db.query(
        "SELECT * FROM organisations WHERE organisation_name = ?",
        [orgname]
    );

    return rows.length > 0;
}
router.post("/", async (req, res) => {
    try {
        const orgname = req.body.organisation_name;

        if (!orgname) {
            return res.status(400).json({
                message: "Organization name is required"
            });
        }

        const exists = await checkOrganizationExists(orgname);

        if (exists) {
            return res.status(400).json({
                message: "Organization already exists"
            });
        }

        const orgId = await createOrganization(orgname);

        return res.status(201).json({
            message: "Organization created successfully",
            organizationId: orgId
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;