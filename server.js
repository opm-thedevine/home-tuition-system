const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Create or open database
const db = new sqlite3.Database("tuition.db");

// Create teachers table
db.run(`
    CREATE TABLE IF NOT EXISTS teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        qualification TEXT NOT NULL,
        experience TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Create students table
db.run(`
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        subject TEXT NOT NULL,
        payment REAL NOT NULL,
        contact TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Test route
app.get("/", (req, res) => {
    res.send("Home Tuition Backend is running");
});
// Save teacher registration
app.post("/register-teacher", (req, res) => {
    const { name, address, qualification, experience } = req.body;

    if (!name || !address || !qualification || !experience) {
        return res.status(400).json({ message: "All teacher fields are required" });
    }

    const sql = `
        INSERT INTO teachers (name, address, qualification, experience)
        VALUES (?, ?, ?, ?)
    `;

    db.run(sql, [name, address, qualification, experience], function (err) {
        if (err) {
            return res.status(500).json({ message: "Failed to save teacher data" });
        }

        res.json({
            message: "Teacher registered successfully",
            teacherId: this.lastID
        });
    });
});

// Save student registration
app.post("/register-student", (req, res) => {
    const { name, subject, payment, contact } = req.body;

    if (!name || !subject || !payment || !contact) {
        return res.status(400).json({ message: "All student fields are required" });
    }

    const sql = `
        INSERT INTO students (name, subject, payment, contact)
        VALUES (?, ?, ?, ?)
    `;

    db.run(sql, [name, subject, payment, contact], function (err) {
        if (err) {
            return res.status(500).json({ message: "Failed to save student data" });
        }

        res.json({
            message: "Student registered successfully",
            studentId: this.lastID
        });
    });
});

// Get all registered teachers
app.get("/teachers", (req, res) => {
    const sql = "SELECT * FROM teachers ORDER BY id DESC";

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Failed to fetch teachers" });
        }

        res.json(rows);
    });
});

// Get all registered students
app.get("/students", (req, res) => {
    const sql = "SELECT * FROM students ORDER BY id DESC";

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Failed to fetch students" });
        }

        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});