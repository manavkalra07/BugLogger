const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                message: "Google credential is required"
            });
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            return res.status(400).json({
                message: "Invalid Google payload"
            });
        }

        const email = payload.email;
        const name = payload.name;
        const isVerified = payload.email_verified === true;

        if (!isVerified) {
            return res.status(400).json({
                message: "Google email is not verified"
            });
        }

        const [userRows] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        let user = userRows;

        if (user.length === 0) {
            await db.query(
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                [name, email, null]
            );

            const [newUserRows] = await db.query(
                "SELECT * FROM users WHERE email = ?",
                [email]
            );
            user = newUserRows;
        }

        const token = jwt.sign(
            {
                userId: user[0].id,
                email: user[0].email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1D"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            userId: user[0].id,
            name: user[0].name,
            email: user[0].email,
            token
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Google Login Failed"
        });
    }
};