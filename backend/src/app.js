console.log("APP.JS LOADED");
const cors = require("cors");
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to BugLogger");
});

app.use(cors());
app.use(express.json());

const organizationRoutes = require("./routes/organizationRoutes");
app.use("/api/organizations", organizationRoutes);

const users = require("./routes/userRoutes");
app.use("/api/users", users);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const authMiddleware = require("./middleware/authMiddleware");
app.use("/api/secure", authMiddleware, (req, res) => {  
    res.json({ message: "This is a secure endpoint", user: req.user });
});

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

module.exports = app;