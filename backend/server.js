require("dotenv").config();

const express = require("express");
const pool = require("./db");
const employeeRoutes = require("./routes/employeeRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(errorHandler);

app.get("/", (req, res) => {
    res.json({
        message: "Employee Resource Directory API is running"
    });
});

app.use("/api/employees", employeeRoutes);

async function testDatabaseConnection() {
    try {
        const connection = await pool.getConnection();

        console.log("MySQL database connected successfully!");

        connection.release();
    } catch (error) {
        console.error("MySQL connection failed:", error.message);
    }
}

testDatabaseConnection();


const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;