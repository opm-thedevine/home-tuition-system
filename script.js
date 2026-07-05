const teacherForm = document.getElementById("teacherForm");
const studentForm = document.getElementById("studentForm");

teacherForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const teacherData = {
        name: document.getElementById("teacherName").value,
        address: document.getElementById("teacherAddress").value,
        qualification: document.getElementById("teacherQualification").value,
        experience: document.getElementById("teacherExperience").value
    };

    try {
        const response = await fetch("http://localhost:3000/register-teacher", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(teacherData)
        });

        const result = await response.json();

        alert(result.message);
        teacherForm.reset();

    } catch (error) {
        alert("Something went wrong while saving teacher data.");
        console.log(error);
    }
});

studentForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const studentData = {
        name: document.getElementById("studentName").value,
        subject: document.getElementById("studentSubject").value,
        payment: document.getElementById("studentPayment").value,
        contact: document.getElementById("studentContact").value
    };

    try {
        const response = await fetch("http://localhost:3000/register-student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        });

        const result = await response.json();

        alert(result.message);
        studentForm.reset();

    } catch (error) {
        alert("Something went wrong while saving student data.");
        console.log(error);
    }
});


async function loadTeachers() {
    const teachersList = document.getElementById("teachersList");

    try {
        const response = await fetch("http://localhost:3000/teachers");
        const teachers = await response.json();

        teachersList.innerHTML = "";

        if (teachers.length === 0) {
            teachersList.innerHTML = "<p>No teachers registered yet.</p>";
            return;
        }

        teachers.forEach(function (teacher) {
            teachersList.innerHTML += `
                <div class="data-item">
                    <p><strong>Name:</strong> ${teacher.name}</p>
                    <p><strong>Address:</strong> ${teacher.address}</p>
                    <p><strong>Qualification:</strong> ${teacher.qualification}</p>
                    <p><strong>Experience:</strong> ${teacher.experience}</p>
                </div>
            `;
        });

    } catch (error) {
        teachersList.innerHTML = "<p>Failed to load teachers.</p>";
        console.log(error);
    }
}

async function loadStudents() {
    const studentsList = document.getElementById("studentsList");

    try {
        const response = await fetch("http://localhost:3000/students");
        const students = await response.json();

        studentsList.innerHTML = "";

        if (students.length === 0) {
            studentsList.innerHTML = "<p>No students registered yet.</p>";
            return;
        }

        students.forEach(function (student) {
            studentsList.innerHTML += `
                <div class="data-item">
                    <p><strong>Name:</strong> ${student.name}</p>
                    <p><strong>Subject:</strong> ${student.subject}</p>
                    <p><strong>Payment Offer:</strong> Rs. ${student.payment}</p>
                    <p><strong>Contact:</strong> ${student.contact}</p>
                </div>
            `;
        });

    } catch (error) {
        studentsList.innerHTML = "<p>Failed to load students.</p>";
        console.log(error);
    }
}