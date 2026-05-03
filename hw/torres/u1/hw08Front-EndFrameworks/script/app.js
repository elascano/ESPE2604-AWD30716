const apiBase = "https://american-latin-class-backend-production.up.railway.app";
const sessionKey = "alc-session";

const roleLabels = {
  teacher: "Profesor",
  student: "Alumno",
  director: "Director"
};

const modulesByRole = {
  teacher: [
    { id: "moduleOverview", label: "Resumen" },
    { id: "moduleClassPlan", label: "Planificacion" },
    { id: "moduleAttendance", label: "Asistencia manual" }
  ],
  student: [
    { id: "moduleStudentProfile", label: "Mi perfil" },
    { id: "moduleStudentAttendance", label: "Mi asistencia" }
  ],
  director: [
    { id: "moduleOverview", label: "Resumen" },
    { id: "moduleStudents", label: "Alumnos" },
    { id: "moduleAttendance", label: "Asistencia manual" },
    { id: "moduleFinance", label: "Finanzas" },
    { id: "moduleAgency", label: "B2 profesional" }
  ]
};

let branches = [];
let currentUser = null;
let dashboardData = {
  students: [],
  financeReports: [],
  events: [],
  me: null,
  studentAttendance: []
};

document.addEventListener("DOMContentLoaded", () => {
  loadBranches().finally(() => {
    fillBranchSelects();
    initEnrollmentPage();
    initLoginPage();
    initKioskPage();
    initDashboardPage();
  });
});

async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json"
  };

  if (options.auth !== false) {
    const session = getSession();

    if (session?.token) {
      headers.Authorization = `Bearer ${session.token}`;
    }
  }

  const response = await fetch(`${apiBase}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    if (response.status === 401) {
      clearSession();
    }

    throw new Error(payload.message || firstError(payload.errors) || "No se pudo completar la solicitud.");
  }

  return payload;
}

function firstError(errors) {
  if (!errors) {
    return "";
  }

  return Object.values(errors)[0] || "";
}

async function loadBranches() {
  try {
    const payload = await apiRequest("/api/branches", { auth: false });
    branches = payload.data || [];
  } catch (error) {
    branches = [
      { id: 1, name: "Matriz" },
      { id: 2, name: "Norte" },
      { id: 3, name: "Quitumbe" },
      { id: 4, name: "Conocoto" },
      { id: 5, name: "Tumbaco" }
    ];
  }
}

function fillBranchSelects() {
  document.querySelectorAll("#enrollBranch, #financeBranch").forEach((select) => {
    select.innerHTML = branches.map((branch) => (
      `<option value="${branch.id}">${escapeHtml(branch.name)}</option>`
    )).join("");
  });
}

function getSession() {
  const saved = sessionStorage.getItem(sessionKey);

  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    return null;
  }
}

function setSession(session) {
  sessionStorage.setItem(sessionKey, JSON.stringify(session));
}

function clearSession() {
  sessionStorage.removeItem(sessionKey);
}

function initEnrollmentPage() {
  const form = document.getElementById("enrollmentForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      branch_id: Number(document.getElementById("enrollBranch").value),
      national_id: onlyDigits(document.getElementById("enrollNationalId").value),
      full_name: document.getElementById("enrollName").value.trim(),
      email: document.getElementById("enrollEmail").value.trim().toLowerCase(),
      phone: document.getElementById("enrollPhone").value.trim(),
      level: document.getElementById("enrollLevel").value,
      scholarship_percent: Number(document.getElementById("enrollScholarship").value),
      guardian_name: document.getElementById("enrollGuardian").value.trim(),
      guardian_phone: document.getElementById("enrollGuardianPhone").value.trim()
    };

    try {
      await apiRequest("/api/enrollments", {
        method: "POST",
        auth: false,
        body: payload
      });
      form.reset();
      fillBranchSelects();
      showMessage("enrollmentMessage", "Solicitud enviada. La academia revisara tus datos antes de activar la matricula.");
    } catch (error) {
      showMessage("enrollmentMessage", error.message);
    }
  });
}

function initLoginPage() {
  const form = document.getElementById("loginForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const payload = await apiRequest("/api/auth/login", {
        method: "POST",
        auth: false,
        body: {
          email: document.getElementById("loginEmail").value.trim().toLowerCase(),
          password: document.getElementById("loginPassword").value
        }
      });

      setSession(payload);
      window.location.href = "dashboard.html";
    } catch (error) {
      showMessage("loginMessage", error.message);
    }
  });
}

function initKioskPage() {
  const form = document.getElementById("kioskForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const payload = await apiRequest("/api/kiosk/attendance", {
        method: "POST",
        auth: false,
        body: {
          national_id: onlyDigits(document.getElementById("kioskNationalId").value)
        }
      });
      const name = payload.student?.name ? ` para ${payload.student.name}` : "";
      const hour = payload.data?.check_in_at ? ` Hora: ${formatDateTime(payload.data.check_in_at)}.` : "";
      showMessage("kioskMessage", `${payload.message}${name}.${hour}`);
      form.reset();
    } catch (error) {
      showMessage("kioskMessage", error.message);
    }
  });
}

async function initDashboardPage() {
  const shell = document.querySelector(".dashboard-shell");

  if (!shell) {
    return;
  }

  const session = getSession();

  if (!session?.token || !session?.user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = session.user;
  setText("sessionRole", roleLabels[currentUser.role] || "Portal interno");
  setText("dashboardTitle", roleLabels[currentUser.role] || "Dashboard");
  setText("sessionName", currentUser.name);

  document.getElementById("logoutButton").addEventListener("click", () => {
    clearSession();
    window.location.href = "login.html";
  });

  setDefaultDates();
  buildModuleNavigation(currentUser.role);
  bindDashboardForms();

  try {
    await loadDashboardData();
    renderDashboard();
  } catch (error) {
    showDashboardError(error.message);
  }
}

async function loadDashboardData() {
  dashboardData.me = await apiRequest("/api/me");

  if (currentUser.role === "director") {
    const [studentsPayload, financePayload, eventsPayload] = await Promise.all([
      apiRequest("/api/students"),
      apiRequest("/api/branch-finance-reports"),
      apiRequest("/api/professional-events")
    ]);
    dashboardData.students = studentsPayload.data || [];
    dashboardData.financeReports = financePayload.data || [];
    dashboardData.events = eventsPayload.data || [];
  }

  if (currentUser.role === "student") {
    const month = document.getElementById("studentAttendanceMonth").value;
    const attendancePayload = await apiRequest(`/api/me/attendance?month=${encodeURIComponent(month)}`);
    dashboardData.studentAttendance = attendancePayload.data || [];
    dashboardData.studentAttendanceSummary = attendancePayload.summary || {};
  }
}

function buildModuleNavigation(role) {
  const nav = document.getElementById("moduleNav");
  const modules = modulesByRole[role] || [];

  nav.innerHTML = modules.map((module, index) => (
    `<button type="button" class="${index === 0 ? "active" : ""}" data-module-target="${module.id}">${escapeHtml(module.label)}</button>`
  )).join("");

  nav.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => activateModule(button.dataset.moduleTarget));
  });

  if (modules[0]) {
    activateModule(modules[0].id);
  }
}

function activateModule(moduleId) {
  document.querySelectorAll(".module-view").forEach((view) => {
    view.hidden = view.id !== moduleId;
  });

  document.querySelectorAll("[data-module-target]").forEach((button) => {
    button.classList.toggle("active", button.dataset.moduleTarget === moduleId);
  });
}

function renderDashboard() {
  renderSnapshot();
  renderStudents();
  renderStudentProfile();
  renderStudentAttendance();
  renderFinance();
  renderSettlements();
}

function renderSnapshot() {
  const students = dashboardData.students;
  const b2Count = students.filter((student) => student.level === "B2").length;
  const scholarshipCount = students.filter((student) => Number(student.scholarship_percent) > 0).length;
  const reserve = dashboardData.financeReports.reduce((total, report) => total + Number(report.matrix_share_amount || 0), 0);

  setText("totalStudents", students.length || (currentUser.role === "student" ? 1 : 0));
  setText("b2Students", b2Count);
  setText("scholarshipStudents", scholarshipCount);
  setText("reserveAmount", formatCurrency(reserve));
}

function renderStudents() {
  const table = document.getElementById("studentsTable");

  if (!table) {
    return;
  }

  table.innerHTML = dashboardData.students.map((student) => `
    <tr>
      <td>${escapeHtml(student.full_name)}</td>
      <td>${escapeHtml(student.branch?.name || branchName(student.branch_id))}</td>
      <td><span class="badge level">${escapeHtml(student.level)}</span></td>
      <td>${Number(student.scholarship_percent || 0)}%</td>
      <td><span class="badge status">${escapeHtml(student.status)}</span></td>
    </tr>
  `).join("");
}

function renderStudentProfile() {
  const container = document.getElementById("studentProfile");

  if (!container) {
    return;
  }

  const student = dashboardData.me?.student;
  const summary = dashboardData.me?.attendance_summary || {};

  if (!student) {
    container.innerHTML = `<article class="panel"><p>No hay perfil de alumno vinculado a esta cuenta.</p></article>`;
    return;
  }

  container.innerHTML = `
    <article class="panel">
      <p class="eyebrow">Alumno</p>
      <h3>${escapeHtml(student.full_name)}</h3>
      <p>${escapeHtml(student.branch?.name || branchName(student.branch_id))} | ${escapeHtml(student.level)} | Beca ${Number(student.scholarship_percent || 0)}%</p>
    </article>
    <article class="panel">
      <p class="eyebrow">Asistencia del mes</p>
      <h3>${Number(summary.present || 0)} presentes</h3>
      <p>${Number(summary.total || 0)} registros encontrados</p>
    </article>
    <article class="panel">
      <p class="eyebrow">Estado</p>
      <h3>${escapeHtml(student.status)}</h3>
      <p>Cuenta vinculada al control academico</p>
    </article>
  `;
}

function renderStudentAttendance() {
  const table = document.getElementById("studentAttendanceTable");

  if (!table) {
    return;
  }

  const summary = dashboardData.studentAttendanceSummary || {};
  setText("studentAttendanceTotal", Number(summary.total || 0));
  setText("studentAttendancePresent", Number(summary.present || 0));
  setText("studentAttendanceLate", Number(summary.late || 0));
  setText("studentAttendanceAbsent", Number(summary.absent || 0));

  if (dashboardData.studentAttendance.length === 0) {
    table.innerHTML = `<tr><td colspan="4">No existen registros para este mes.</td></tr>`;
    return;
  }

  table.innerHTML = dashboardData.studentAttendance.map((record) => `
    <tr>
      <td>${escapeHtml(record.attendance_date)}</td>
      <td>${escapeHtml(record.check_in_at ? formatDateTime(record.check_in_at) : "Manual")}</td>
      <td><span class="badge status">${escapeHtml(record.status)}</span></td>
      <td>${escapeHtml(record.evidence_code)}</td>
    </tr>
  `).join("");
}

function renderFinance() {
  const table = document.getElementById("financeTable");

  if (!table) {
    return;
  }

  table.innerHTML = dashboardData.financeReports.map((report) => `
    <tr>
      <td>${escapeHtml(branchName(report.branch_id))}</td>
      <td>${formatCurrency(report.income)}</td>
      <td>${formatCurrency(report.expenses)}</td>
      <td>${formatCurrency(report.matrix_share_amount)}</td>
      <td>${formatCurrency(report.net_result)}</td>
    </tr>
  `).join("");
}

function renderSettlements() {
  const list = document.getElementById("settlementList");

  if (!list) {
    return;
  }

  if (dashboardData.events.length === 0) {
    list.innerHTML = `<article class="summary-item"><span>No hay eventos registrados.</span></article>`;
    return;
  }

  list.innerHTML = dashboardData.events.map((event) => `
    <article class="summary-item">
      <strong>${escapeHtml(event.client_name)}</strong>
      <span>${escapeHtml(event.event_type)} | ${escapeHtml(event.event_date)}</span>
      <span>Total: ${formatCurrency(event.total_amount)}</span>
      <span>Estado: ${escapeHtml(event.status)}</span>
    </article>
  `).join("");
}

function bindDashboardForms() {
  bindClassPlanForm();
  bindAttendanceForm();
  bindFinanceForm();
  bindEventForm();
  bindStudentAttendanceMonth();
}

function bindClassPlanForm() {
  const form = document.getElementById("classPlanForm");

  if (!form) {
    return;
  }

  setValue("planTeacher", currentUser.name);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      await apiRequest("/api/class-plans", {
        method: "POST",
        body: {
          branch_id: currentUser.branch_id || 1,
          teacher_name: document.getElementById("planTeacher").value.trim(),
          month: document.getElementById("planMonth").value,
          level: document.getElementById("planLevel").value,
          objective: document.getElementById("planObjective").value.trim(),
          activities: document.getElementById("planActivities").value.trim()
        }
      });
      form.reset();
      setDefaultDates();
      setValue("planTeacher", currentUser.name);
      showMessage("planMessage", "Plan mensual enviado para revision.");
    } catch (error) {
      showMessage("planMessage", error.message);
    }
  });
}

function bindAttendanceForm() {
  const form = document.getElementById("attendanceForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const payload = await apiRequest("/api/attendance-records", {
        method: "POST",
        body: {
          branch_id: currentUser.branch_id || 1,
          person_type: document.getElementById("attendanceType").value,
          person_name: document.getElementById("attendanceName").value.trim(),
          attendance_date: document.getElementById("attendanceDate").value,
          status: document.getElementById("attendanceStatus").value
        }
      });
      form.reset();
      setDefaultDates();
      showMessage("attendanceMessage", `Asistencia guardada: ${payload.data.evidence_code}.`);
    } catch (error) {
      showMessage("attendanceMessage", error.message);
    }
  });
}

function bindFinanceForm() {
  const form = document.getElementById("financeForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      await apiRequest("/api/branch-finance-reports", {
        method: "POST",
        body: {
          branch_id: Number(document.getElementById("financeBranch").value),
          month: new Date().toISOString().slice(0, 7),
          income: Number(document.getElementById("financeIncome").value),
          expenses: Number(document.getElementById("financeExpenses").value),
          matrix_share_percent: Number(document.getElementById("financeShare").value)
        }
      });
      const financePayload = await apiRequest("/api/branch-finance-reports");
      dashboardData.financeReports = financePayload.data || [];
      renderDashboard();
    } catch (error) {
      alert(error.message);
    }
  });
}

function bindEventForm() {
  const form = document.getElementById("eventForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const eventPayload = await apiRequest("/api/professional-events", {
        method: "POST",
        body: {
          branch_id: currentUser.branch_id || 1,
          client_name: document.getElementById("eventClient").value.trim(),
          event_type: document.getElementById("eventType").value.trim(),
          event_date: document.getElementById("eventDate").value,
          total_amount: Number(document.getElementById("eventAmount").value),
          status: "paid"
        }
      });
      const dancerName = document.getElementById("eventDancer").value.trim().toLowerCase();
      const dancer = dashboardData.students.find((student) => (
        student.level === "B2" && student.full_name.toLowerCase() === dancerName
      ));

      if (dancer) {
        await apiRequest(`/api/professional-events/${eventPayload.data.id}/assignments`, {
          method: "POST",
          body: {
            student_id: dancer.id,
            gross_amount: Number(document.getElementById("eventAmount").value),
            deduction_amount: Number(document.getElementById("eventDeduction").value),
            payment_status: "paid"
          }
        });
      }

      form.reset();
      setDefaultDates();
      const eventsPayload = await apiRequest("/api/professional-events");
      dashboardData.events = eventsPayload.data || [];
      renderDashboard();
      showMessage("eventMessage", dancer ? "Evento B2 registrado y asignado." : "Evento registrado. El bailarin no se asigno porque no se encontro como B2 activo.");
    } catch (error) {
      showMessage("eventMessage", error.message);
    }
  });
}

function bindStudentAttendanceMonth() {
  const input = document.getElementById("studentAttendanceMonth");

  if (!input) {
    return;
  }

  input.addEventListener("change", async () => {
    try {
      const payload = await apiRequest(`/api/me/attendance?month=${encodeURIComponent(input.value)}`);
      dashboardData.studentAttendance = payload.data || [];
      dashboardData.studentAttendanceSummary = payload.summary || {};
      renderStudentAttendance();
    } catch (error) {
      showDashboardError(error.message);
    }
  });
}

function setDefaultDates() {
  const today = new Date().toISOString().slice(0, 10);
  const month = today.slice(0, 7);

  setValue("attendanceDate", today);
  setValue("eventDate", today);
  setValue("planMonth", month);
  setValue("studentAttendanceMonth", month);
}

function setValue(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.value = value;
  }
}

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

function showMessage(id, text) {
  const message = document.getElementById(id);

  if (!message) {
    return;
  }

  message.textContent = text;
  window.setTimeout(() => {
    message.textContent = "";
  }, 7000);
}

function showDashboardError(text) {
  const content = document.querySelector(".dashboard-content");

  if (content) {
    content.insertAdjacentHTML("afterbegin", `<p class="notice panel">${escapeHtml(text)}</p>`);
  }
}

function branchName(branchId) {
  const branch = branches.find((item) => Number(item.id) === Number(branchId));
  return branch ? branch.name : "Pendiente";
}

function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
}

function formatDateTime(value) {
  return new Date(value).toLocaleString("es-EC", {
    dateStyle: "short",
    timeStyle: "short"
  });
}

function onlyDigits(value) {
  return value.replace(/\D+/g, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

