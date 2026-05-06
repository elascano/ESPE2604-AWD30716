const storageKey = "alc-hw08-state";
const sessionKey = "alc-hw08-session";

const branches = [
  { id: 1, name: "Matriz", director: "Juan Pablo Hidalgo" },
  { id: 2, name: "Norte", director: "Pendiente" },
  { id: 3, name: "Quitumbe", director: "Pendiente" },
  { id: 4, name: "Conocoto", director: "Pendiente" },
  { id: 5, name: "Tumbaco", director: "Pendiente" }
];

const demoUsers = {
  "profesor@americanlatinclass.com": {
    password: "demo123",
    role: "teacher",
    name: "Andrea Molina"
  },
  "alumno@americanlatinclass.com": {
    password: "demo123",
    role: "student",
    name: "Valeria Paz"
  },
  "director@americanlatinclass.com": {
    password: "demo123",
    role: "director",
    name: "Juan Pablo Hidalgo"
  }
};

const roleLabels = {
  teacher: "Profesor",
  student: "Alumno",
  director: "Director"
};

const modulesByRole = {
  teacher: [
    { id: "moduleOverview", label: "Resumen" },
    { id: "moduleClassPlan", label: "Planificacion" },
    { id: "moduleAttendance", label: "Asistencia" }
  ],
  student: [
    { id: "moduleStudentProfile", label: "Mi avance" }
  ],
  director: [
    { id: "moduleOverview", label: "Resumen" },
    { id: "moduleStudents", label: "Alumnos" },
    { id: "moduleAttendance", label: "Asistencia" },
    { id: "moduleFinance", label: "Finanzas" },
    { id: "moduleAgency", label: "B2 profesional" }
  ]
};

const initialState = {
  students: [
    { id: 1, fullName: "Camila Rojas", branchId: 1, level: "B1", scholarship: 0, status: "active", guardianName: "Maria Rojas" },
    { id: 2, fullName: "Mateo Vera", branchId: 2, level: "B1", scholarship: 50, status: "active", guardianName: "Patricia Vera" },
    { id: 3, fullName: "Valeria Paz", branchId: 3, level: "B2", scholarship: 100, status: "active", guardianName: "Luis Paz" },
    { id: 4, fullName: "Julian Mena", branchId: 4, level: "B2", scholarship: 75, status: "active", guardianName: "Andrea Mena" }
  ],
  attendance: [
    { personType: "student", personName: "Valeria Paz", date: "2026-05-03", status: "present", evidence: "ALC-20260503-1201" },
    { personType: "student", personName: "Mateo Vera", date: "2026-05-03", status: "late", evidence: "ALC-20260503-1202" },
    { personType: "teacher", personName: "Andrea Molina", date: "2026-05-03", status: "present", evidence: "ALC-20260503-1203" }
  ],
  classPlans: [],
  financeReports: [
    { branchId: 1, income: 2400, expenses: 920, matrixSharePercent: 0 },
    { branchId: 2, income: 1450, expenses: 530, matrixSharePercent: 15 }
  ],
  events: [
    { client: "Hotel Sol", type: "Private show", date: "2026-05-01", dancer: "Valeria Paz", gross: 180, deduction: 10 },
    { client: "Andina Group", type: "Corporate event", date: "2026-05-02", dancer: "Julian Mena", gross: 220, deduction: 0 }
  ],
  reserve: 850
};

let state = loadState();

document.addEventListener("DOMContentLoaded", () => {
  fillBranchSelects();
  initEnrollmentPage();
  initLoginPage();
  initDashboardPage();
});

function loadState() {
  const saved = localStorage.getItem(storageKey);

  if (!saved) {
    return structuredClone(initialState);
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    return structuredClone(initialState);
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function getSession() {
  const saved = localStorage.getItem(sessionKey);

  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    return null;
  }
}

function setSession(user) {
  localStorage.setItem(sessionKey, JSON.stringify({
    email: user.email,
    role: user.role,
    name: user.name
  }));
}

function branchName(branchId) {
  const branch = branches.find((item) => item.id === Number(branchId));
  return branch ? branch.name : "Pendiente";
}

function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
}

function fillBranchSelects() {
  document.querySelectorAll("#enrollBranch, #financeBranch").forEach((select) => {
    select.innerHTML = branches.map((branch) => (
      `<option value="${branch.id}">${branch.name}</option>`
    )).join("");
  });
}

function setDefaultDates() {
  const today = new Date().toISOString().slice(0, 10);
  const month = today.slice(0, 7);

  setValue("attendanceDate", today);
  setValue("eventDate", today);
  setValue("planMonth", month);
}

function setValue(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.value = value;
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
  }, 5000);
}

function initEnrollmentPage() {
  const form = document.getElementById("enrollmentForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const student = {
      id: Date.now(),
      fullName: document.getElementById("enrollName").value.trim(),
      email: document.getElementById("enrollEmail").value.trim().toLowerCase(),
      phone: document.getElementById("enrollPhone").value.trim(),
      branchId: Number(document.getElementById("enrollBranch").value),
      level: document.getElementById("enrollLevel").value,
      scholarship: Number(document.getElementById("enrollScholarship").value),
      guardianName: document.getElementById("enrollGuardian").value.trim(),
      guardianPhone: document.getElementById("enrollGuardianPhone").value.trim(),
      notes: document.getElementById("enrollNotes").value.trim(),
      status: "pending"
    };

    state.students.push(student);
    saveState();
    form.reset();
    fillBranchSelects();
    showMessage("enrollmentMessage", "Solicitud enviada para revision.");

    if (window.alcSupabase) {
      window.alcSupabase.insert("students", {
        branch_id: student.branchId,
        full_name: student.fullName,
        email: student.email,
        phone: student.phone,
        level: student.level,
        scholarship_percent: student.scholarship,
        guardian_name: student.guardianName,
        guardian_phone: student.guardianPhone,
        status: "pending"
      }).catch((error) => showMessage("enrollmentMessage", error.message));
    }
  });
}

function initLoginPage() {
  const form = document.getElementById("loginForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    loginWithCredentials(
      document.getElementById("loginEmail").value,
      document.getElementById("loginPassword").value
    );
  });

  document.querySelectorAll("[data-demo-login]").forEach((button) => {
    button.addEventListener("click", () => {
      const account = Object.entries(demoUsers).find(([, user]) => (
        user.role === button.dataset.demoLogin
      ));

      if (account) {
        const [email, user] = account;
        setSession({ ...user, email });
        window.location.href = "dashboard.html";
      }
    });
  });
}

function loginWithCredentials(emailValue, passwordValue) {
  const email = emailValue.trim().toLowerCase();
  const user = demoUsers[email];

  if (!user || user.password !== passwordValue) {
    showMessage("loginMessage", "Credenciales no validas.");
    return;
  }

  setSession({ ...user, email });
  window.location.href = "dashboard.html";
}

function initDashboardPage() {
  const shell = document.querySelector(".dashboard-shell");

  if (!shell) {
    return;
  }

  const session = getSession();

  if (!session) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("sessionRole").textContent = roleLabels[session.role] || "Portal interno";
  document.getElementById("dashboardTitle").textContent = roleLabels[session.role] || "Dashboard";
  document.getElementById("sessionName").textContent = session.name;

  document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem(sessionKey);
    window.location.href = "login.html";
  });

  document.getElementById("resetDemo").addEventListener("click", () => {
    state = structuredClone(initialState);
    saveState();
    renderDashboard(session);
  });

  bindDashboardForms();
  setDefaultDates();
  buildModuleNavigation(session.role);
  renderDashboard(session);
}

function buildModuleNavigation(role) {
  const nav = document.getElementById("moduleNav");
  const modules = modulesByRole[role] || [];

  nav.innerHTML = modules.map((module, index) => (
    `<button type="button" class="${index === 0 ? "active" : ""}" data-module-target="${module.id}">${module.label}</button>`
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

function renderDashboard(session) {
  renderSnapshot();
  renderStudents();
  renderStudentProfile(session);
  renderFinance();
  renderSettlements();
}

function renderSnapshot() {
  const b2Count = state.students.filter((student) => student.level === "B2").length;
  const scholarshipCount = state.students.filter((student) => Number(student.scholarship) > 0).length;

  setText("totalStudents", state.students.length);
  setText("b2Students", b2Count);
  setText("scholarshipStudents", scholarshipCount);
  setText("reserveAmount", formatCurrency(state.reserve));
}

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

function renderStudents() {
  const table = document.getElementById("studentsTable");

  if (!table) {
    return;
  }

  table.innerHTML = state.students.map((student) => `
    <tr>
      <td>${student.fullName}</td>
      <td>${branchName(student.branchId)}</td>
      <td><span class="badge level">${student.level}</span></td>
      <td>${student.scholarship}%</td>
      <td><span class="badge status">${student.status}</span></td>
    </tr>
  `).join("");
}

function renderStudentProfile(session) {
  const container = document.getElementById("studentProfile");

  if (!container) {
    return;
  }

  const student = state.students.find((item) => item.fullName === session.name) || state.students[0];
  const records = state.attendance.filter((item) => item.personName === student.fullName);
  const presentCount = records.filter((item) => item.status === "present").length;
  const attendancePercent = records.length ? Math.round((presentCount / records.length) * 100) : 100;

  container.innerHTML = `
    <article class="panel">
      <p class="eyebrow">Alumno</p>
      <h3>${student.fullName}</h3>
      <p>${branchName(student.branchId)} | ${student.level} | Beca ${student.scholarship}%</p>
    </article>
    <article class="panel">
      <p class="eyebrow">Asistencia</p>
      <h3>${attendancePercent}%</h3>
      <p>${records.length} registros encontrados</p>
    </article>
    <article class="panel">
      <p class="eyebrow">Estado</p>
      <h3>${student.status}</h3>
      <p>Seguimiento academico activo</p>
    </article>
  `;
}

function renderFinance() {
  const table = document.getElementById("financeTable");

  if (!table) {
    return;
  }

  table.innerHTML = state.financeReports.map((report) => {
    const matrixShare = report.income * (report.matrixSharePercent / 100);
    const netResult = report.income - report.expenses - matrixShare;

    return `
      <tr>
        <td>${branchName(report.branchId)}</td>
        <td>${formatCurrency(report.income)}</td>
        <td>${formatCurrency(report.expenses)}</td>
        <td>${formatCurrency(matrixShare)}</td>
        <td>${formatCurrency(netResult)}</td>
      </tr>
    `;
  }).join("");
}

function renderSettlements() {
  const list = document.getElementById("settlementList");

  if (!list) {
    return;
  }

  const grouped = state.events.reduce((result, event) => {
    if (!result[event.dancer]) {
      result[event.dancer] = { events: 0, gross: 0, deductions: 0 };
    }

    result[event.dancer].events += 1;
    result[event.dancer].gross += Number(event.gross);
    result[event.dancer].deductions += Number(event.deduction);

    return result;
  }, {});

  list.innerHTML = Object.entries(grouped).map(([dancer, summary]) => `
    <article class="summary-item">
      <strong>${dancer}</strong>
      <span>Eventos: ${summary.events}</span>
      <span>Bruto: ${formatCurrency(summary.gross)}</span>
      <span>Descuentos: ${formatCurrency(summary.deductions)}</span>
      <span>Neto: ${formatCurrency(summary.gross - summary.deductions)}</span>
    </article>
  `).join("");
}

function bindDashboardForms() {
  bindClassPlanForm();
  bindAttendanceForm();
  bindFinanceForm();
  bindEventForm();
}

function bindClassPlanForm() {
  const form = document.getElementById("classPlanForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const plan = {
      teacher: document.getElementById("planTeacher").value.trim(),
      month: document.getElementById("planMonth").value,
      level: document.getElementById("planLevel").value,
      objective: document.getElementById("planObjective").value.trim(),
      activities: document.getElementById("planActivities").value.trim()
    };

    state.classPlans.push(plan);
    saveState();
    form.reset();
    setDefaultDates();
    showMessage("planMessage", "Plan mensual enviado.");

    window.alcSupabase.insert("class_plans", {
      branch_id: 1,
      teacher_name: plan.teacher,
      month: plan.month,
      level: plan.level,
      objective: plan.objective,
      activities: plan.activities,
      status: "submitted"
    }).catch((error) => showMessage("planMessage", error.message));
  });
}

function bindAttendanceForm() {
  const form = document.getElementById("attendanceForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const evidence = `ALC-${Date.now().toString().slice(-6)}`;
    const attendance = {
      personType: document.getElementById("attendanceType").value,
      personName: document.getElementById("attendanceName").value.trim(),
      date: document.getElementById("attendanceDate").value,
      status: document.getElementById("attendanceStatus").value,
      evidence
    };

    state.attendance.push(attendance);
    saveState();
    renderDashboard(getSession());
    form.reset();
    setDefaultDates();
    showMessage("attendanceMessage", `Asistencia guardada: ${evidence}.`);

    window.alcSupabase.insert("attendance_records", {
      branch_id: 1,
      person_type: attendance.personType,
      person_name: attendance.personName,
      attendance_date: attendance.date,
      status: attendance.status,
      evidence_code: evidence
    }).catch((error) => showMessage("attendanceMessage", error.message));
  });
}

function bindFinanceForm() {
  const form = document.getElementById("financeForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const report = {
      branchId: Number(document.getElementById("financeBranch").value),
      income: Number(document.getElementById("financeIncome").value),
      expenses: Number(document.getElementById("financeExpenses").value),
      matrixSharePercent: Number(document.getElementById("financeShare").value),
      month: new Date().toISOString().slice(0, 7)
    };

    state.financeReports.push(report);
    state.reserve += report.income * (report.matrixSharePercent / 100);
    saveState();
    renderDashboard(getSession());

    window.alcSupabase.insert("branch_finance_reports", {
      branch_id: report.branchId,
      month: report.month,
      income: report.income,
      expenses: report.expenses,
      matrix_share_percent: report.matrixSharePercent
    }).catch(() => {});
  });
}

function bindEventForm() {
  const form = document.getElementById("eventForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const professionalEvent = {
      client: document.getElementById("eventClient").value.trim(),
      type: document.getElementById("eventType").value.trim(),
      date: document.getElementById("eventDate").value,
      dancer: document.getElementById("eventDancer").value.trim(),
      gross: Number(document.getElementById("eventAmount").value),
      deduction: Number(document.getElementById("eventDeduction").value)
    };

    state.events.push(professionalEvent);
    saveState();
    renderDashboard(getSession());
    form.reset();
    setDefaultDates();
    showMessage("eventMessage", "Evento B2 registrado.");

    window.alcSupabase.insert("professional_events", {
      branch_id: 1,
      client_name: professionalEvent.client,
      event_type: professionalEvent.type,
      event_date: professionalEvent.date,
      total_amount: professionalEvent.gross,
      status: "paid"
    }).catch((error) => showMessage("eventMessage", error.message));
  });
}
