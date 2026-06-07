const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("Welcome to BugLogger");
});


app.use(express.json());
const organizationRoutes = require("./routes/organizationRoutes");
app.use("/api/organizations", organizationRoutes);
module.exports = app;