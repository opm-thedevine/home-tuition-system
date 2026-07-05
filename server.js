const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const DATA_FILE = path.join(__dirname, "data.json");

function readData() {
    if (!fs.existsSync(DATA_FILE)) {
        return {
            teachers: [],
            students: []
        };
    }

    const fileData = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(fileData);
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Home route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Save teacher registration
app.post("/register-teacher", (req, res) => {
    const { name, address, qualification, experience } = req.body;

    if (!name || !address || !qualification || !experience) {
        return res.status(400).json({
            message: "All teacher fields are required"
        });
    }

    const data = readData();

    const newTeacher = {
        id: Date.now(),
        name,
        address,
        qualification,
        experience,
        created_at: new Date().toISOString()
    };

    data.teachers.push(newTeacher);
    writeData(data);

    res.json({
        message: "Teacher registered successfully",
        teacher: newTeacher
    });
});

// Save student registration
app.post("/register-student", (req, res) => {
    const { name, subject, payment, contact } = req.body;

    if (!name || !subject || !payment || !contact) {
        return res.status(400).json({
            message: "All student fields are required"
        });
    }

    const data = readData();

    const newStudent = {
        id: Date.now(),
        name,
        subject,
        payment,
        contact,
        created_at: new Date().toISOString()
    };

    data.students.push(newStudent);
    writeData(data);

    res.json({
        message: "Student registered successfully",
        student: newStudent
    });
});

// Get all registered teachers
app.get("/teachers", (req, res) => {
    const data = readData();
    res.json(data.teachers.reverse());
});

// Get all registered students
app.get("/students", (req, res) => {
    const data = readData();
    res.json(data.students.reverse());
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
