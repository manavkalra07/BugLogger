const app = require("./app");
const db = require("./config/db");
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        const connection = await db.getConnection();

        console.log("Connected to the database");

        connection.release();

        app.listen(PORT, () => {
            console.log("Server is running on port " + PORT);
        });

    } catch (error) {
        console.log("Error connecting to the database");
        console.error(error);

        process.exit(1);
    }
}

startServer();