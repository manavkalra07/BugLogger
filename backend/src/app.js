console.log("APP.JS LOADED");

const cors = require("cors");
const express = require("express");

const app = express();


app.get("/", (req, res) => {
    res.send("Welcome to BugLogger");
});


app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const organizationRoutes = require("./routes/organizationRoutes");
const users = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const bugRoutes = require("./routes/bugRoutes");

const authMiddleware = require("./middleware/authMiddleware");
const teamMiddleware = require("./middleware/teamMiddleware");

const teamRoutes = require("./routes/teamRoutes");

app.use(
    "/api/organizations",
    organizationRoutes
);

app.use(
    "/api/users",
    users
);

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/dashboard",
    dashboardRoutes
);

app.use(
    "/api/bugs",
    bugRoutes
);

app.use(
    "/api/secure",
    authMiddleware,
    teamMiddleware,
    (req, res) => {

        res.json({

            message: "This is a secure endpoint",

            user: req.user,
            team: req.team || null

        });

    }
);

app.use(
    "/api/team",
    teamRoutes
);


module.exports = app;