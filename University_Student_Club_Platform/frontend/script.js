// Backend URL
const API = "http://localhost:8080/api";

let selectedClubId = null;
let currentStudentUserId = null;

// Küçük yardımcılar
function showMainMenu() {
    document.getElementById("mainMenu").style.display = "flex";
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("authForm").style.display = "none";
    document.getElementById("authPanel").style.display = "none";
    document.getElementById("addClubForm").style.display = "none";
    document.getElementById("panelButtons").style.display = "flex";
    document.getElementById("listArea").innerHTML = "";

    // Öğrenci giriş mesajını gizle
    const msg = document.getElementById("loginSuccessMessage");
    if (msg) msg.style.display = "none";

    // Öğrenci giriş sonrası sayfayı gizle
    const studentHome = document.getElementById("studentHome");
    if (studentHome) studentHome.style.display = "none";
}

function showElement(id, display = "flex") {
    document.getElementById(id).style.display = display;
}

function hideElement(id) {
    document.getElementById(id).style.display = "none";
}

// ---------------- ANA MENÜ ---------------- //

document.getElementById("btnLogin").addEventListener("click", () => {
    hideElement("mainMenu");
    clearForm("loginForm");
    showElement("loginForm", "flex");

    // Form açılınca başarı mesajını gizle
    const msg = document.getElementById("loginSuccessMessage");
    if (msg) msg.style.display = "none";

    // Öğrenci giriş sonrası sayfayı gizle
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

// Giriş ekranından geri
document.getElementById("btnLoginBack").addEventListener("click", () => {
    showMainMenu();
});

// Kayıt ekranından geri
document.getElementById("btnBack").addEventListener("click", () => {
    showMainMenu();
});

// Yetkili giriş ekranından geri
document.getElementById("btnBack2").addEventListener("click", () => {
    showMainMenu();
});

// Öğrenci giriş sonrası sayfadan geri
document.getElementById("btnStudentBack").addEventListener("click", () => {
    showMainMenu();
});

// ---------------- ÖĞRENCİ GİRİŞİ ---------------- //

document.getElementById("btnLoginSubmit").addEventListener("click", async () => {
    const userid   = document.getElementById("loginUserId").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const msg = document.getElementById("loginSuccessMessage");
    if (msg) msg.style.display = "none";

    if (!userid || !password) {
        alert("Lütfen tüm alanları doldurun!");
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

            // Temiz sayfaya geçiş
            hideElement("loginForm");
            hideElement("mainMenu");
            hideElement("registerForm");
            hideElement("authForm");
            hideElement("authPanel");

            const studentHome = document.getElementById("studentHome");
            if (studentHome) studentHome.style.display = "block";
        } else {
            alert("Kullanıcı adı veya şifre hatalı!");
        }
    } catch (err) {
        console.error("HATA →", err);
        alert("Bağlantı hatası!");
    }
});

// ---------------- KAYIT İŞLEMİ ---------------- //

document.getElementById("btnSubmitRegister").addEventListener("click", async () => {
    const userid    = document.getElementById("regUserId").value.trim();
    const password  = document.getElementById("regPassword").value.trim();
    const password2 = document.getElementById("regPassword2").value.trim();
    const fname     = document.getElementById("regFname").value.trim();
    const lname     = document.getElementById("regLname").value.trim();
    const phone     = document.getElementById("regPhone").value.trim();

    if (!userid || !password || !password2 || !fname || !lname || !phone) {
        alert("Lütfen tüm alanları doldurun!");
        return;
    }

    if (password !== password2) {
        alert("Şifreler eşleşmiyor!");
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
            alert("Kayıt başarıyla oluşturuldu!");
            showMainMenu();
        } else {
            alert("Kayıt başarısız! Bu kullanıcı zaten olabilir.");
        }
    } catch (err) {
        console.error("HATA →", err);
        alert("Bağlantı hatası. Backend çalışıyor mu?");
    }
});

// ---------------- YETKİLİ GİRİŞİ ---------------- //

document.getElementById("btnAuthLogin").addEventListener("click", async () => {
    const id       = document.getElementById("authId").value.trim();
    const password = document.getElementById("authPassword").value.trim();

    if (!id || !password) {
        alert("Lütfen tüm alanları doldurun!");
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
            alert("Giriş başarısız!");
        }
    } catch (err) {
        console.error("HATA →", err);
        alert("Bağlantı hatası!");
    }
});

// Yetkili panelinden ana menüye geri
document.getElementById("btnAuthBack").addEventListener("click", () => {
    showMainMenu();
});

// ---------------- YÖNETİM PANELİ ---------------- //

// Kulüp Ekle butonu → SADECE form görünsün
document.getElementById("btnAddClub").addEventListener("click", () => {
    hideElement("panelButtons");
    document.getElementById("listArea").innerHTML = "";
    showElement("addClubForm", "flex");
});

// Kulüp ekleme iptal
document.getElementById("btnCancelAddClub").addEventListener("click", () => {
    hideElement("addClubForm");
    showElement("panelButtons", "flex");
});

// Kulüp ekleme kaydet
document.getElementById("btnSubmitClub").addEventListener("click", async () => {
    const name = document.getElementById("clubName").value.trim();
    const info = document.getElementById("clubInfo").value.trim();

    if (!name || !info) {
        alert("Lütfen tüm alanları doldurun!");
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
            alert("Kulüp başarıyla eklendi!");
            document.getElementById("clubName").value = "";
            document.getElementById("clubInfo").value = "";
            hideElement("addClubForm");
            showElement("panelButtons", "flex");
        } else {
            alert("Kulüp eklenemedi. Aynı isimde kulüp olabilir.");
        }
    } catch (err) {
        console.error("HATA →", err);
        alert("Bağlantı hatası!");
    }
});

// Kulüpleri Listele
document.getElementById("btnListClubs").addEventListener("click", async () => {
    hideElement("addClubForm");
    document.getElementById("listArea").innerHTML = "";

    try {
        const res = await fetch(`${API}/clubs`);
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            document.getElementById("listArea").innerHTML = "<p>Hiç kulüp yok.</p>";
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Kulüp Adı</th>
                        <th>Bilgi</th>
                        <th>İşlem</th>
                        <th>Duyuru</th>
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
                            Sil
                        </button>
                    </td>
                    <td>
                        <button onclick="openAnnouncementForm(${c.id})">
                            Duyuru Ekle
                        </button>
                    </td>
                </tr>
            `;
        });

        html += "</tbody></table>";

        document.getElementById("listArea").innerHTML = html;
    } catch (err) {
        console.error("HATA →", err);
        alert("Kulüpler alınırken hata oluştu.");
    }
});

// Öğrencileri Listele
document.getElementById("btnListStudents").addEventListener("click", async () => {
    hideElement("addClubForm");
    document.getElementById("listArea").innerHTML = "";

    try {
        const res = await fetch(`${API}/students`);
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            document.getElementById("listArea").innerHTML = "<p>Hiç öğrenci yok.</p>";
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Kullanıcı Adı</th>
                        <th>İsim</th>
                        <th>Soyisim</th>
                        <th>Telefon</th>
                        <th>İşlem</th>
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
                        Sil
                        </button>
                    </td>
                </tr>
            `;
        });

        html += "</tbody></table>";

        document.getElementById("listArea").innerHTML = html;
    } catch (err) {
        console.error("HATA →", err);
        alert("Öğrenciler alınırken hata oluştu.");
    }
});

//kulübü sil
async function deleteClub(clubId) {
    if (!confirm("Bu kulübü silmek istediğinize emin misiniz?")) return;

    const response = await fetch(`${API}/club/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ id: clubId })
    });

    const result = await response.json();

    if (result === 1) {
        alert("Kulüp silindi.");
        document.getElementById("btnListClubs").click();
    } else {
        alert("Kulüp silinemedi.");
    }
}

//Duyuruları görüntüle
function openAnnouncementForm(clubId) {
    selectedClubId = clubId;
    hideElement("panelButtons");
    document.getElementById("listArea").innerHTML = "";
    showElement("announcementForm", "flex");
}

//Duyuru ekleme
document.getElementById("btnSaveAnnouncement").addEventListener("click", async () => {
    const text = document.getElementById("announcementText").value.trim();

    if (!text) {
        alert("Duyuru boş olamaz!");
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
        alert("Duyuru eklendi.");
        document.getElementById("announcementText").value = "";
        hideElement("announcementForm");
        showElement("panelButtons", "flex");
    } else {
        alert("Duyuru eklenemedi.");
    }
});

document.getElementById("btnCancelAnnouncement").addEventListener("click", () => {
    document.getElementById("announcementText").value = "";
    hideElement("announcementForm");
    showElement("panelButtons", "flex");
});

// Yetkili tarafından seçilen öğrenciyi userid ile siler
async function deleteStudent(userid) {
    if (!confirm("Bu öğrenciyi silmek istediğinize emin misiniz?")) return;

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
        alert("Öğrenci silindi.");
        document.getElementById("btnListStudents").click();
    } else {
        alert("Öğrenci silinemedi.");
    }
}

// Öğrencinin üyesi olduğu kulüpleri listeler
document.getElementById("btnMyClubs").addEventListener("click", async () => {
    if (!currentStudentUserId) {
        alert("Öğrenci bilgisi bulunamadı.");
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
                "<p>Üye olduğunuz kulüp bulunmamaktadır.</p>";
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Kulüp Adı</th>
                        <th>Bilgi</th>
                        <th>Duyurular</th>
                        <th>Ayrıl</th>
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
                            Duyurular
                        </button>
                    </td>
                    <td>
                        <button onclick="leaveClub(${c.id})">
                            Ayrıl
                        </button>
                    </td>
                </tr>
            `;
        });

        html += "</tbody></table>";

        document.getElementById("studentListArea").innerHTML = html;
    } catch (err) {
        console.error(err);
        alert("Kulüpler alınırken hata oluştu.");
    }
});


// Öğrenci ekranında tüm kulüpleri listeler
document.getElementById("btnListAllClubs").addEventListener("click", async () => {

    document.getElementById("studentListArea").innerHTML = "";

    try {
        const response = await fetch(`${API}/clubs`);
        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            document.getElementById("studentListArea").innerHTML =
                "<p>Hiç kulüp bulunmamaktadır.</p>";
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Kulüp Adı</th>
                        <th>Bilgi</th>
                        <th>İşlem</th>
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
                            Üye Ol
                        </button>
                    </td>
                </tr>
            `;
        });

        html += "</tbody></table>";

        document.getElementById("studentListArea").innerHTML = html;

    } catch (err) {
        console.error(err);
        alert("Kulüpler alınırken hata oluştu.");
    }
});


// Öğrenci kendi hesabını siler
document.getElementById("btnDeleteAccount").addEventListener("click", async () => {

    if (!currentStudentUserId) {
        alert("Öğrenci bilgisi bulunamadı.");
        return;
    }

    if (!confirm("Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) {
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
            alert("Hesabınız silindi.");
            currentStudentUserId = null;
            showMainMenu();
        } else {
            alert("Hesap silinemedi.");
        }

    } catch (err) {
        console.error(err);
        alert("Bağlantı hatası!");
    }
});

// Öğrenciyi seçilen kulübe üye yapar
async function joinClub(clubId) {

    if (!currentStudentUserId) {
        alert("Öğrenci bilgisi bulunamadı.");
        return;
    }

    if (!confirm("Bu kulübe üye olmak istiyor musunuz?")) return;

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
            alert("Kulübe başarıyla üye oldunuz.");
        } else {
            alert("Zaten bu kulübe üyesiniz.");
        }

    } catch (err) {
        console.error(err);
        alert("Üye olma sırasında hata oluştu.");
    }
}

// Öğrencinin seçtiği kulübün duyurularını listeler
async function viewAnnouncements(clubId) {
    document.getElementById("studentListArea").innerHTML = "";

    try {
        const response = await fetch(
            `${API}/announcement/list?clubId=${clubId}`
        );
        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            document.getElementById("studentListArea").innerHTML =
                "<p>Bu kulüp için duyuru bulunmamaktadır.</p>";
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Duyuru</th>
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
        alert("Duyurular alınırken hata oluştu.");
    }
}

// Öğrencinin kulüpten ayrılması
async function leaveClub(clubId) {
    if (!confirm("Bu kulüpten ayrılmak istediğinize emin misiniz?")) return;

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
            alert("Kulüpten ayrıldınız.");
            document.getElementById("btnMyClubs").click(); // tabloyu yenile
        } else {
            alert("Kulüpten ayrılma başarısız.");
        }
    } catch (err) {
        console.error(err);
        alert("Bağlantı hatası.");
    }
}

function clearForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.querySelectorAll("input, textarea").forEach(el => {
        el.value = "";
    });
}
