const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("Welcome to BugLogger");
});


app.use(express.json());
const organizationRoutes = require("./routes/organizationRoutes");
app.use("/api/organizations", organizationRoutes);
const users = require("./routes/userRoutes");
app.use("/api/users", users);
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
module.exports = app;
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);