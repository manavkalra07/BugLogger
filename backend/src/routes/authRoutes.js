const db = require("../config/db");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/emailService");
const { googleLogin } = require("../controllers/authcontroller");

async function FindUserByEmail(email) {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows.length > 0 ? rows[0] : null;
}

const crypto = require("crypto");
function genrateOTP() { 
    return crypto.randomInt(100000, 1000000);}


router.post('/google',googleLogin);
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await FindUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const otp = genrateOTP().toString();
        const hashedOTP = await bcrypt.hash(
            otp,
            10
        );

        await db.query(
            "DELETE FROM password_reset_otps WHERE user_id = ?",
            [user.id]
        );

        const expiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );

        await db.query(
            `INSERT INTO password_reset_otps
            (user_id, otp, expires_at)
            VALUES (?, ?, ?)`,
            [user.id, hashedOTP, expiresAt]
        );

        await sendEmail(
            user.email,
            "BugLogger Password Reset OTP",
            `Your OTP is ${otp}. It is valid for 10 minutes.`
        );

        return res.status(200).json({
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});


router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        const user = await FindUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const [rows] = await db.query(
            "SELECT * FROM password_reset_otps WHERE user_id = ?",
            [user.id]
        );

        if (rows.length === 0) {
            return res.status(400).json({
                message: "OTP not found"
            });
        }

        const otpRecord = rows[0];

        const isValidOTP = await bcrypt.compare(
            otp,
            otpRecord.otp
        );

        if (!isValidOTP) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }
        if (
            new Date() >
            new Date(otpRecord.expires_at)
        ) {
            return res.status(400).json({
                message: "OTP expired"
            });
        }

        return res.status(200).json({
            message: "OTP verified successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});


router.post("/reset-password", async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                message:
                    "Email, OTP and new password are required"
            });
        }

        const user = await FindUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const [rows] = await db.query(
            "SELECT * FROM password_reset_otps WHERE user_id = ?",
            [user.id]
        );

        if (rows.length === 0) {
            return res.status(400).json({
                message: "OTP not found"
            });
        }

        const otpRecord = rows[0];

        const isValidOTP = await bcrypt.compare(
            otp,
            otpRecord.otp
        );

        if (!isValidOTP) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        if (
            new Date() >
            new Date(otpRecord.expires_at)
        ) {
            return res.status(400).json({
                message: "OTP expired"
            });
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        await db.query(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, user.id]
        );

        await db.query(
            "DELETE FROM password_reset_otps WHERE user_id = ?",
            [user.id]
        );

        return res.status(200).json({
            message: "Password reset successful"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});


router.get("/test-email", async (req, res) => {
    try {
        const otp = genrateOTP();

        await sendEmail(
            "iammanavkalra@gmail.com",
            "BugLogger TEST",
            `Your OTP is ${otp}`
        );

        return res.status(200).json({
            message: "Email sent successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to send email"
        });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await FindUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1D"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            userId: user.id,
            name: user.name,
            email: user.email,
            token: token
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;