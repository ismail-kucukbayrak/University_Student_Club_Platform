// Backend URL
const API = "http://localhost:8080/api";

let selectedClubId = null;
let currentStudentUserId = null;

// Small helpers
function showMainMenu() {
    document.getElementById("mainMenu").style.display = "flex";
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("authForm").style.display = "none";
    document.getElementById("authPanel").style.display = "none";
    document.getElementById("addClubForm").style.display = "none";
    document.getElementById("panelButtons").style.display = "flex";
    document.getElementById("listArea").innerHTML = "";

    // Hide student login message
    const msg = document.getElementById("loginSuccessMessage");
    if (msg) msg.style.display = "none";

    // Hide student home page
    const studentHome = document.getElementById("studentHome");
    if (studentHome) studentHome.style.display = "none";
}

function showElement(id, display = "flex") {
    document.getElementById(id).style.display = display;
}

function hideElement(id) {
    document.getElementById(id).style.display = "none";
}

// ---------------- MAIN MENU ---------------- //

document.getElementById("btnLogin").addEventListener("click", () => {
    hideElement("mainMenu");
    clearForm("loginForm");
    showElement("loginForm", "flex");

    // Hide success message when form opens
    const msg = document.getElementById("loginSuccessMessage");
    if (msg) msg.style.display = "none";

    // Hide student home page
    const studentHome = document.getElementById("studentHome");
    if (studentHome) studentHome.style.display = "none";
});

document.getElementById("btnRegister").addEventListener("click", () => {
    hideElement("mainMenu");
    clearForm("registerForm");
    showElement("registerForm", "flex");
});

document.getElementById("btnAuth").addEventListener("click", () => {
    hideElement("mainMenu");
    clearForm("authForm");
    showElement("authForm", "flex");
});

// Back from login screen
document.getElementById("btnLoginBack").addEventListener("click", () => {
    showMainMenu();
});

// Back from register screen
document.getElementById("btnBack").addEventListener("click", () => {
    showMainMenu();
});

// Back from authority login screen
document.getElementById("btnBack2").addEventListener("click", () => {
    showMainMenu();
});

// Back from student home page
document.getElementById("btnStudentBack").addEventListener("click", () => {
    showMainMenu();
});

// ---------------- STUDENT LOGIN ---------------- //

document.getElementById("btnLoginSubmit").addEventListener("click", async () => {
    const userid   = document.getElementById("loginUserId").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const msg = document.getElementById("loginSuccessMessage");
    if (msg) msg.style.display = "none";

    if (!userid || !password) {
        alert("Please fill in all fields!");
        return;
    }

    try {
        const response = await fetch(`${API}/student/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({ userid, password })
        });

        const result = await response.json();

        if (result === 1) {
            currentStudentUserId = userid;

            // Switch to clean page
            hideElement("loginForm");
            hideElement("mainMenu");
            hideElement("registerForm");
            hideElement("authForm");
            hideElement("authPanel");

            const studentHome = document.getElementById("studentHome");
            if (studentHome) studentHome.style.display = "block";
        } else {
            alert("Invalid username or password!");
        }
    } catch (err) {
        console.error("ERROR →", err);
        alert("Connection error!");
    }
});

// ---------------- REGISTER ---------------- //

document.getElementById("btnSubmitRegister").addEventListener("click", async () => {
    const userid    = document.getElementById("regUserId").value.trim();
    const password  = document.getElementById("regPassword").value.trim();
    const password2 = document.getElementById("regPassword2").value.trim();
    const fname     = document.getElementById("regFname").value.trim();
    const lname     = document.getElementById("regLname").value.trim();
    const phone     = document.getElementById("regPhone").value.trim();

    if (!userid || !password || !password2 || !fname || !lname || !phone) {
        alert("Please fill in all fields!");
        return;
    }

    if (password !== password2) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const response = await fetch(`${API}/student/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({ userid, password, fname, lname, phone })
        });

        const result = await response.json();

        if (result === 1) {
            alert("Registration completed successfully!");
            showMainMenu();
        } else {
            alert("Registration failed! This user may already exist.");
        }
    } catch (err) {
        console.error("ERROR →", err);
        alert("Connection error. Is the backend running?");
    }
});

// ---------------- AUTHORITY LOGIN ---------------- //

document.getElementById("btnAuthLogin").addEventListener("click", async () => {
    const id       = document.getElementById("authId").value.trim();
    const password = document.getElementById("authPassword").value.trim();

    if (!id || !password) {
        alert("Please fill in all fields!");
        return;
    }

    try {
        const response = await fetch(`${API}/authority/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({ id, password })
        });

        const result = await response.json();

        if (result === 1) {
            hideElement("authForm");
            showElement("authPanel", "block");
            showElement("panelButtons", "flex");
            document.getElementById("listArea").innerHTML = "";
            hideElement("addClubForm");
        } else {
            alert("Login failed!");
        }
    } catch (err) {
        console.error("ERROR →", err);
        alert("Connection error!");
    }
});

// Back to main menu from authority panel
document.getElementById("btnAuthBack").addEventListener("click", () => {
    showMainMenu();
});

// ---------------- ADMIN PANEL ---------------- //

// Show only add club form
document.getElementById("btnAddClub").addEventListener("click", () => {
    hideElement("panelButtons");
    document.getElementById("listArea").innerHTML = "";
    showElement("addClubForm", "flex");
});

// Cancel add club
document.getElementById("btnCancelAddClub").addEventListener("click", () => {
    hideElement("addClubForm");
    showElement("panelButtons", "flex");
});

// Save club
document.getElementById("btnSubmitClub").addEventListener("click", async () => {
    const name = document.getElementById("clubName").value.trim();
    const info = document.getElementById("clubInfo").value.trim();

    if (!name || !info) {
        alert("Please fill in all fields!");
        return;
    }

    try {
        const response = await fetch(`${API}/club/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({ name, info })
        });

        const result = await response.json();

        if (result === 1) {
            alert("Club added successfully!");
            document.getElementById("clubName").value = "";
            document.getElementById("clubInfo").value = "";
            hideElement("addClubForm");
            showElement("panelButtons", "flex");
        } else {
            alert("Failed to add club. A club with the same name may already exist.");
        }
    } catch (err) {
        console.error("ERROR →", err);
        alert("Connection error!");
    }
});

// List clubs
document.getElementById("btnListClubs").addEventListener("click", async () => {
    hideElement("addClubForm");
    document.getElementById("listArea").innerHTML = "";

    try {
        const res = await fetch(`${API}/clubs`);
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            document.getElementById("listArea").innerHTML = "<p>No clubs found.</p>";
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Club Name</th>
                        <th>Info</th>
                        <th>Action</th>
                        <th>Announcement</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(c => {
            html += `
                <tr>
                    <td>${c.id}</td>
                    <td>${c.name}</td>
                    <td>${c.info}</td>
                    <td>
                        <button onclick="deleteClub(${c.id})">
                            Delete
                        </button>
                    </td>
                    <td>
                        <button onclick="openAnnouncementForm(${c.id})">
                            Add Announcement
                        </button>
                    </td>
                </tr>
            `;
        });

        html += "</tbody></table>";

        document.getElementById("listArea").innerHTML = html;
    } catch (err) {
        console.error("ERROR →", err);
        alert("Error while fetching clubs.");
    }
});

// List students
document.getElementById("btnListStudents").addEventListener("click", async () => {
    hideElement("addClubForm");
    document.getElementById("listArea").innerHTML = "";

    try {
        const res = await fetch(`${API}/students`);
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            document.getElementById("listArea").innerHTML = "<p>No students found.</p>";
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(s => {
            html += `
                <tr>
                    <td>${s.userid}</td>
                    <td>${s.fname}</td>
                    <td>${s.lname}</td>
                    <td>${s.phone}</td>
                    <td>
                        <button onclick="deleteStudent('${s.userid}')">
                        Delete
                        </button>
                    </td>
                </tr>
            `;
        });

        html += "</tbody></table>";

        document.getElementById("listArea").innerHTML = html;
    } catch (err) {
        console.error("ERROR →", err);
        alert("Error while fetching students.");
    }
});

// delete club
async function deleteClub(clubId) {
    if (!confirm("Are you sure you want to delete this club?")) return;

    const response = await fetch(`${API}/club/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ id: clubId })
    });

    const result = await response.json();

    if (result === 1) {
        alert("Club deleted.");
        document.getElementById("btnListClubs").click();
    } else {
        alert("Failed to delete club.");
    }
}

// open announcement form
function openAnnouncementForm(clubId) {
    selectedClubId = clubId;
    hideElement("panelButtons");
    document.getElementById("listArea").innerHTML = "";
    showElement("announcementForm", "flex");
}

// add announcement
document.getElementById("btnSaveAnnouncement").addEventListener("click", async () => {
    const text = document.getElementById("announcementText").value.trim();

    if (!text) {
        alert("Announcement cannot be empty!");
        return;
    }

    const response = await fetch(`${API}/announcement/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            clubId: selectedClubId,
            text: text
        })
    });

    const result = await response.json();

    if (result === 1) {
        alert("Announcement added.");
        document.getElementById("announcementText").value = "";
        hideElement("announcementForm");
        showElement("panelButtons", "flex");
    } else {
        alert("Failed to add announcement.");
    }
});

document.getElementById("btnCancelAnnouncement").addEventListener("click", () => {
    document.getElementById("announcementText").value = "";
    hideElement("announcementForm");
    showElement("panelButtons", "flex");
});

// delete student by authority
async function deleteStudent(userid) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    const response = await fetch(`${API}/student/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            userid: userid
        })
    });

    const result = await response.json();

    if (result === 1) {
        alert("Student deleted.");
        document.getElementById("btnListStudents").click();
    } else {
        alert("Failed to delete student.");
    }
}

// list student's clubs
document.getElementById("btnMyClubs").addEventListener("click", async () => {
    if (!currentStudentUserId) {
        alert("Student information not found.");
        return;
    }

    document.getElementById("studentListArea").innerHTML = "";

    try {
        const response = await fetch(
            `${API}/student/myClubs?userid=${currentStudentUserId}`
        );
        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            document.getElementById("studentListArea").innerHTML =
                "<p>You are not a member of any clubs.</p>";
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Club Name</th>
                        <th>Info</th>
                        <th>Announcements</th>
                        <th>Leave</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(c => {
            html += `
                <tr>
                    <td>${c.id}</td>
                    <td>${c.name}</td>
                    <td>${c.info}</td>
                    <td>
                        <button onclick="viewAnnouncements(${c.id})">
                            View
                        </button>
                    </td>
                    <td>
                        <button onclick="leaveClub(${c.id})">
                            Leave
                        </button>
                    </td>
                </tr>
            `;
        });

        html += "</tbody></table>";

        document.getElementById("studentListArea").innerHTML = html;
    } catch (err) {
        console.error(err);
        alert("Error while fetching clubs.");
    }
});

// list all clubs (student view)
document.getElementById("btnListAllClubs").addEventListener("click", async () => {

    document.getElementById("studentListArea").innerHTML = "";

    try {
        const response = await fetch(`${API}/clubs`);
        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            document.getElementById("studentListArea").innerHTML =
                "<p>No clubs available.</p>";
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Club Name</th>
                        <th>Info</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(c => {
            html += `
                <tr>
                    <td>${c.id}</td>
                    <td>${c.name}</td>
                    <td>${c.info}</td>
                    <td>
                        <button onclick="joinClub(${c.id})">
                            Join
                        </button>
                    </td>
                </tr>
            `;
        });

        html += "</tbody></table>";

        document.getElementById("studentListArea").innerHTML = html;

    } catch (err) {
        console.error(err);
        alert("Error while fetching clubs.");
    }
});

// delete own account
document.getElementById("btnDeleteAccount").addEventListener("click", async () => {

    if (!currentStudentUserId) {
        alert("Student information not found.");
        return;
    }

    if (!confirm("Are you sure you want to delete your account? This action cannot be undone!")) {
        return;
    }

    try {
        const response = await fetch(`${API}/student/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                userid: currentStudentUserId
            })
        });

        const result = await response.json();

        if (result === 1) {
            alert("Your account has been deleted.");
            currentStudentUserId = null;
            showMainMenu();
        } else {
            alert("Failed to delete account.");
        }

    } catch (err) {
        console.error(err);
        alert("Connection error!");
    }
});

// join club
async function joinClub(clubId) {

    if (!currentStudentUserId) {
        alert("Student information not found.");
        return;
    }

    if (!confirm("Do you want to join this club?")) return;

    try {
        const response = await fetch(`${API}/club/addStudent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                clubId: clubId,
                userid: currentStudentUserId
            })
        });

        const result = await response.json();

        if (result === 1) {
            alert("Successfully joined the club.");
        } else {
            alert("You are already a member of this club.");
        }

    } catch (err) {
        console.error(err);
        alert("Error occurred while joining.");
    }
}

// view announcements
async function viewAnnouncements(clubId) {
    document.getElementById("studentListArea").innerHTML = "";

    try {
        const response = await fetch(
            `${API}/announcement/list?clubId=${clubId}`
        );
        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            document.getElementById("studentListArea").innerHTML =
                "<p>No announcements for this club.</p>";
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Announcement</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(a => {
            html += `
                <tr>
                    <td>${a.id}</td>
                    <td>${a.text}</td>
                </tr>
            `;
        });

        html += "</tbody></table>";

        document.getElementById("studentListArea").innerHTML = html;

    } catch (err) {
        console.error(err);
        alert("Error while fetching announcements.");
    }
}

// leave club
async function leaveClub(clubId) {
    if (!confirm("Are you sure you want to leave this club?")) return;

    try {
        const response = await fetch(`${API}/club/deleteStudent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                clubId: clubId,
                userid: currentStudentUserId
            })
        });

        const result = await response.json();

        if (result === 1) {
            alert("You left the club.");
            document.getElementById("btnMyClubs").click();
        } else {
            alert("Failed to leave the club.");
        }
    } catch (err) {
        console.error(err);
        alert("Connection error.");
    }
}

function clearForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.querySelectorAll("input, textarea").forEach(el => {
        el.value = "";
    });
}