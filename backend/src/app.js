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
module.exports = app;