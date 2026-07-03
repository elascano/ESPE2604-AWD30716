class DashboardController {
  constructor(config, apiClient, sessionStore, branchStore) {
    this.config = config;
    this.apiClient = apiClient;
    this.sessionStore = sessionStore;
    this.branchStore = branchStore;
    this.currentUser = null;
    this.currentModule = null;
    this.data = {
      me: null,
      students: [],
      teachers: [],
      attendance: [],
      classPlans: [],
      financeReports: [],
      events: [],
      studentAttendance: [],
      studentAttendanceSummary: {},
      teacherPayroll: {}
    };
  }

  async init() {
    if (!document.querySelector(".dashboard-shell")) return;

    const session = this.sessionStore.get();
    if (!session?.token || !session?.user) {
      window.location.href = "login.html";
      return;
    }

    this.currentUser = session.user;
    this.setDefaultMonth();
    this.renderShell();
    this.currentModule = this.moduleFromCurrentPath()?.id || this.currentModule;
    this.normalizeCurrentRoute();
    this.syncActiveModuleButton();
    this.bindShell();
    await this.reloadData();
  }

  setDefaultMonth() {
    const month = new Date().toISOString().slice(0, 7);
    Dom.setValue("dashboardMonth", month);
  }

  selectedMonth() {
    return document.getElementById("dashboardMonth")?.value || new Date().toISOString().slice(0, 7);
  }

  renderShell() {
    const label = this.config.roleLabels[this.currentUser.role] || "School portal";
    Dom.setText("sessionRole", label);
    Dom.setText("dashboardTitle", label);
    Dom.setText("sessionName", this.currentUser.name);
    this.renderSessionProfile(label);

    const modules = this.config.modulesByRole[this.currentUser.role] || [];
    const nav = document.getElementById("moduleNav");
    nav.innerHTML = modules.map((module, index) => `
      <button type="button" class="${index === 0 ? "active" : ""}" data-module="${module.id}">
        <i class="bi ${module.icon}"></i>
        ${Dom.escape(module.label)}
      </button>
    `).join("");

    this.currentModule = modules[0]?.id || null;
  }

  renderSessionProfile(label) {
    Dom.setText("sessionHeaderName", this.currentUser.name || this.currentUser.email || "Signed in");
    Dom.setText("sessionHeaderRole", label);
    Dom.setText("sessionAvatarInitials", Dom.initials(this.currentUser.name || this.currentUser.email));

    const avatar = document.getElementById("sessionAvatarImage");
    const avatarShell = avatar?.closest(".session-avatar");
    const avatarUrl = this.currentUser.avatar_url || this.currentUser.photo_url || "";

    if (!avatar || !avatarShell) return;

    if (avatarUrl) {
      avatar.src = avatarUrl;
      avatarShell.classList.add("has-image");
    } else {
      avatar.removeAttribute("src");
      avatarShell.classList.remove("has-image");
    }
  }

  bindShell() {
    document.getElementById("homeButton").addEventListener("click", () => {
      window.location.href = "/";
    });

    const logoutModal = new bootstrap.Modal("#logoutModal");
    const logoutConfirm = document.getElementById("logoutConfirm");

    document.getElementById("logoutButton").addEventListener("click", () => {
      logoutModal.show();
    });

    logoutConfirm.addEventListener("click", () => {
      logoutModal.hide();
      this.sessionStore.clear();
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }
      window.location.replace("login.html");
    });

    document.getElementById("moduleNav").addEventListener("click", (event) => {
      const button = event.target.closest("[data-module]");
      if (!button) return;

      this.activateModule(button.dataset.module, true);
    });

    document.getElementById("dashboardMonth").addEventListener("change", () => this.reloadData());

    window.addEventListener("popstate", () => {
      const module = this.moduleFromCurrentPath();
      if (module) {
        this.activateModule(module.id, false);
        this.normalizeCurrentRoute();
      }
    });

    window.addEventListener("pageshow", () => {
      const session = this.sessionStore.get();
      if (!session?.token || !session?.user) {
        window.location.replace("login.html");
      }
    });
  }

  modules() {
    return this.config.modulesByRole[this.currentUser.role] || [];
  }

  moduleFromCurrentPath() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const rawSlug = parts[0] === "dashboard" ? parts[1] : "";
    const slug = this.config.routeAliases[rawSlug || "overview"] || "overview";

    return this.modules().find((module) => module.slug === slug) || this.modules()[0] || null;
  }

  moduleById(moduleId) {
    return this.modules().find((module) => module.id === moduleId) || this.modules()[0] || null;
  }

  normalizeCurrentRoute() {
    const module = this.moduleById(this.currentModule);
    if (!module) return;

    const canonicalPath = `/dashboard/${module.slug}`;
    if (window.location.pathname !== canonicalPath) {
      window.history.replaceState({ module: module.id }, "", canonicalPath);
    }
  }

  activateModule(moduleId, pushUrl) {
    const module = this.moduleById(moduleId);
    if (!module) return;

    this.currentModule = module.id;
    this.syncActiveModuleButton();

    if (pushUrl) {
      window.history.pushState({ module: module.id }, "", `/dashboard/${module.slug}`);
    }

    this.render();
  }

  syncActiveModuleButton() {
    document.querySelectorAll("[data-module]").forEach((button) => {
      button.classList.toggle("active", button.dataset.module === this.currentModule);
    });
  }

  async reloadData() {
    try {
      await this.loadData();
      this.render();
    } catch (error) {
      if (!this.sessionStore.get()?.token) {
        window.location.replace("login.html");
        return;
      }

      document.getElementById("moduleHost").innerHTML = `<div class="alert alert-danger">${Dom.escape(error.message)}</div>`;
    }
  }

  async loadData() {
    const month = this.selectedMonth();
    this.data.me = await this.apiClient.request(`/api/me?month=${encodeURIComponent(month)}`);
    this.syncCurrentUser(this.data.me.user);

    if (this.currentUser.role === "student") {
      const attendancePayload = await this.apiClient.request(`/api/me/attendance?month=${encodeURIComponent(month)}`);
      this.data.studentAttendance = attendancePayload.data || [];
      this.data.studentAttendanceSummary = attendancePayload.summary || {};
    }

    if (this.currentUser.role === "teacher") {
      const [attendancePayload, plansPayload] = await Promise.all([
        this.apiClient.request(`/api/attendance-records?month=${encodeURIComponent(month)}`),
        this.apiClient.request("/api/class-plans")
      ]);
      this.data.attendance = attendancePayload.data || [];
      this.data.teacherPayroll = attendancePayload.teacher_payroll || {};
      this.data.classPlans = plansPayload.data || [];
    }

    if (this.currentUser.role === "director") {
      const [studentsPayload, teachersPayload, attendancePayload, plansPayload, financePayload, eventsPayload] = await Promise.all([
        this.apiClient.request("/api/students"),
        this.apiClient.request("/api/teachers"),
        this.apiClient.request(`/api/attendance-records?month=${encodeURIComponent(month)}`),
        this.apiClient.request("/api/class-plans"),
        this.apiClient.request("/api/branch-finance-reports"),
        this.apiClient.request("/api/professional-events")
      ]);
      this.data.students = studentsPayload.data || [];
      this.data.teachers = teachersPayload.data || [];
      this.data.attendance = attendancePayload.data || [];
      this.data.teacherPayroll = attendancePayload.teacher_payroll || {};
      this.data.classPlans = plansPayload.data || [];
      this.data.financeReports = financePayload.data || [];
      this.data.events = eventsPayload.data || [];
    }
  }

  syncCurrentUser(userPayload) {
    if (!userPayload) return;

    const session = this.sessionStore.get();
    const nextUser = { ...(session?.user || this.currentUser), ...userPayload };
    this.sessionStore.set({ ...(session || {}), user: nextUser });
    this.currentUser = nextUser;
    this.renderSessionProfile(this.config.roleLabels[this.currentUser.role] || "School portal");
  }

  render() {
    const module = (this.config.modulesByRole[this.currentUser.role] || []).find((item) => item.id === this.currentModule);
    Dom.setText("moduleTitle", module?.label || "Overview");

    const renderers = {
      "student-overview": () => this.renderStudentOverview(),
      "student-schedule": () => this.renderStudentSchedule(),
      "student-attendance": () => this.renderStudentAttendance(),
      "student-events": () => this.renderStudentEvents(),
      "teacher-overview": () => this.renderTeacherOverview(),
      "teacher-student-attendance": () => this.renderStudentAttendanceControl(),
      "teacher-planning": () => this.renderTeacherPlanning(),
      "teacher-work-log": () => this.renderTeacherWorkLog(),
      "director-overview": () => this.renderDirectorOverview(),
      "director-students": () => this.renderDirectorStudents(),
      "director-teachers": () => this.renderDirectorTeachers(),
      "director-payroll": () => this.renderDirectorPayroll(),
      "director-planning": () => this.renderDirectorPlanning(),
      "director-finance": () => this.renderDirectorFinance(),
      "director-events": () => this.renderDirectorEvents()
    };

    document.getElementById("moduleHost").innerHTML = renderers[this.currentModule]?.() || "";
    this.branchStore.fillSelects();
    this.bindRenderedModule();
  }

  renderMetrics(metrics) {
    return `<div class="metric-grid">${metrics.map((metric) => `
      <article class="metric-card">
        <span>${Dom.escape(metric.label)}</span>
        <strong>${Dom.escape(metric.value)}</strong>
      </article>
    `).join("")}</div>`;
  }

  renderStudentOverview() {
    const student = this.data.me?.student || {};
    const summary = this.data.studentAttendanceSummary || this.data.me?.attendance_summary || {};
    const total = Number(summary.total || 0);
    const attended = Number(summary.present || 0) + Number(summary.late || 0);
    const percent = total > 0 ? Math.round((attended / total) * 100) : 0;
    const profilePhoto = student.photo_url || this.currentUser.photo_url || this.currentUser.avatar_url || "";

    return `
      ${this.renderMetrics([
        { label: "Attendance", value: Formatters.percent(percent) },
        { label: "Branch", value: this.branchStore.name(student.branch_id) },
        { label: "Level", value: student.level || "Pending" },
        { label: "Scholarship", value: Formatters.percent(student.scholarship_percent) }
      ])}
      <section class="module-card">
        <h3>${Dom.escape(student.full_name || this.currentUser.name)}</h3>
        <p class="muted">Status: ${Dom.escape(student.status || "active")} | Email: ${Dom.escape(student.email || this.currentUser.email)}</p>
      </section>
      <form class="module-card profile-photo-card" id="profilePhotoForm">
        <div class="profile-photo-preview ${profilePhoto ? "has-image" : ""}">
          <img id="profilePhotoPreview" src="${Dom.escape(profilePhoto)}" alt="">
          <span>${Dom.escape(Dom.initials(student.full_name || this.currentUser.name))}</span>
        </div>
        <div class="form-stack">
          <div>
            <h3>Profile photo</h3>
            <p class="muted">Upload a PNG, JPEG, or WEBP image. The portal will show it in the session header.</p>
          </div>
          <label>
            <span>Student photo</span>
            <input id="profilePhotoInput" class="form-control" type="file" accept="image/png,image/jpeg,image/webp" required>
          </label>
          <button class="btn btn-warning fw-bold" type="submit"><i class="bi bi-image"></i> Save photo</button>
          <p class="notice" id="profilePhotoMessage"></p>
        </div>
      </form>
    `;
  }

  renderStudentSchedule() {
    const student = this.data.me?.student || {};
    const level = student.level || "B1";
    const schedule = this.config.defaultSchedules[level] || [];

    return `
      <div class="module-grid">
        ${schedule.map((item) => `<article class="module-card"><h3>${Dom.escape(level)}</h3><p>${Dom.escape(item)}</p></article>`).join("")}
      </div>
    `;
  }

  renderStudentAttendance() {
    return `
      ${this.renderMetrics([
        { label: "Records", value: String(this.data.studentAttendanceSummary.total || 0) },
        { label: "Present", value: String(this.data.studentAttendanceSummary.present || 0) },
        { label: "Late", value: String(this.data.studentAttendanceSummary.late || 0) },
        { label: "Absent", value: String(this.data.studentAttendanceSummary.absent || 0) }
      ])}
      <section class="module-card">
        <h3>Attendance calendar</h3>
        ${this.renderAttendanceCalendar(this.data.studentAttendance)}
      </section>
    `;
  }

  renderStudentEvents() {
    return `<div class="module-grid">${this.config.upcomingEvents.map((event) => `
      <article class="module-card">
        <h3>${Dom.escape(event.title)}</h3>
        <p>${Dom.escape(event.date)} | ${Dom.escape(event.branch)}</p>
      </article>
    `).join("")}</div>`;
  }

  renderTeacherOverview() {
    const payroll = this.data.teacherPayroll || {};
    return `
      ${this.renderMetrics([
        { label: "Worked hours", value: String(payroll.payable_hours || 0) },
        { label: "Estimated pay", value: Formatters.currency(payroll.gross_amount || 0) },
        { label: "Late days", value: String(payroll.late || 0) },
        { label: "Records", value: String(payroll.records || 0) }
      ])}
      <section class="module-card">
        <h3>Hourly rate</h3>
        <p class="muted">Teacher class payments are calculated at $12 per class hour. Late records stay visible for director review.</p>
      </section>
    `;
  }

  renderStudentAttendanceControl() {
    return `
      <form class="module-card form-grid" id="attendanceForm">
        <input type="hidden" id="attendanceType" value="student">
        <label>
          <span>Student name</span>
          <input id="attendanceName" class="form-control" type="text" placeholder="Mateo Vera" maxlength="120" pattern="[A-Za-zÀ-ÿñÑ\\s'-]+" required>
        </label>
        <label>
          <span>Date</span>
          <input id="attendanceDate" class="form-control" type="date" required>
        </label>
        <label>
          <span>Status</span>
          <select id="attendanceStatus" class="form-select">
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="absent">Absent</option>
            <option value="excused">Excused</option>
          </select>
        </label>
        <label>
          <span>Level</span>
          <select id="attendanceLevel" class="form-select">
            <option>B1</option>
            <option>B2</option>
          </select>
        </label>
        <button class="btn btn-warning fw-bold full" type="submit"><i class="bi bi-check2"></i> Save attendance</button>
        <p class="notice full" id="attendanceMessage"></p>
      </form>
    `;
  }

  renderTeacherPlanning() {
    return `
      <form class="module-card form-grid" id="classPlanForm">
        <label>
          <span>Teacher</span>
          <input id="planTeacher" class="form-control" type="text" value="${Dom.escape(this.currentUser.name)}" required>
        </label>
        <label>
          <span>Month</span>
          <input id="planMonth" class="form-control" type="month" value="${Dom.escape(this.selectedMonth())}" required>
        </label>
        <label>
          <span>Level</span>
          <select id="planLevel" class="form-select"><option>B1</option><option>B2</option></select>
        </label>
        <label>
          <span>Planning document URL</span>
          <input id="planDocumentUrl" class="form-control" type="url" placeholder="https://drive.google.com/..." inputmode="url">
        </label>
        <label class="full">
          <span>Objective</span>
          <input id="planObjective" class="form-control" type="text" placeholder="Improve rhythm and footwork" maxlength="180" required>
        </label>
        <label class="full">
          <span>Activities</span>
          <textarea id="planActivities" class="form-control" rows="4" required></textarea>
        </label>
        <button class="btn btn-warning fw-bold full" type="submit"><i class="bi bi-upload"></i> Submit planning</button>
        <p class="notice full" id="planMessage"></p>
      </form>
    `;
  }

  renderTeacherWorkLog() {
    return this.renderAttendanceTable(this.data.attendance, true);
  }

  renderDirectorOverview() {
    const activeStudents = this.data.students.filter((student) => student.status === "active");
    const scholarships = this.data.students.filter((student) => Number(student.scholarship_percent) > 0);
    const activeTeachers = this.data.teachers.filter((teacher) => teacher.is_active);
    return `
      ${this.renderMetrics([
        { label: "Students", value: String(activeStudents.length) },
        { label: "Teachers", value: String(activeTeachers.length) },
        { label: "Scholarships", value: String(scholarships.length) },
        { label: "Teacher pay", value: Formatters.currency(this.data.teacherPayroll.gross_amount || 0) }
      ])}
      <section class="module-card">
        <h3>Students by branch</h3>
        ${this.renderBranchTotals()}
      </section>
    `;
  }

  renderBranchTotals() {
    return `<div class="module-grid">${this.branchStore.branches.map((branch) => {
      const count = this.data.students.filter((student) => Number(student.branch_id) === Number(branch.id)).length;
      return `<div class="summary-list"><span>${Dom.escape(branch.name)}: ${count}</span></div>`;
    }).join("")}</div>`;
  }

  renderDirectorStudents() {
    return `
      <form class="module-card form-grid" id="studentForm">
        <label><span>Name</span><input id="studentName" class="form-control" maxlength="120" pattern="[A-Za-zÀ-ÿñÑ\\s'-]+" required></label>
        <label><span>Email</span><input id="studentEmail" class="form-control" type="email" autocomplete="off" autocapitalize="none" spellcheck="false" required></label>
        <label><span>National ID</span><input id="studentNationalId" class="form-control" inputmode="numeric" maxlength="10" pattern="\\d{10}" required></label>
        <label><span>Phone</span><input id="studentPhone" class="form-control" type="tel" inputmode="tel" maxlength="15" pattern="[0-9+\\s-]{7,15}" required></label>
        <label><span>Branch</span><select id="studentBranch" class="form-select" data-branch-select></select></label>
        <label><span>Level</span><select id="studentLevel" class="form-select"><option>B1</option><option>B2</option></select></label>
        <label><span>Scholarship</span><select id="studentScholarship" class="form-select">${this.scholarshipOptions(0)}</select></label>
        <label><span>Status</span><select id="studentStatus" class="form-select"><option value="active">Active</option><option value="pending">Pending</option><option value="inactive">Inactive</option></select></label>
        <button class="btn btn-warning fw-bold full" type="submit"><i class="bi bi-plus-circle"></i> Add student</button>
        <p class="notice full" id="studentMessage"></p>
      </form>
      ${this.renderStudentsTable()}
    `;
  }

  renderStudentsTable() {
    return `
      <section class="module-card table-card">
        <table class="table align-middle">
          <thead><tr><th>Name</th><th>Branch</th><th>Level</th><th>Scholarship</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>${this.data.students.map((student) => `
            <tr>
              <td>${Dom.escape(student.full_name)}</td>
              <td>${Dom.escape(student.branch?.name || this.branchStore.name(student.branch_id))}</td>
              <td>${Dom.escape(student.level)}</td>
              <td><select class="form-select form-select-sm" data-student-scholarship="${student.id}">${this.scholarshipOptions(student.scholarship_percent)}</select></td>
              <td><select class="form-select form-select-sm" data-student-status="${student.id}">${this.statusOptions(student.status)}</select></td>
              <td><div class="action-row">
                <button class="btn btn-sm btn-outline-dark" data-save-student="${student.id}"><i class="bi bi-save"></i> Save</button>
                <button class="btn btn-sm btn-outline-danger" data-disable-student="${student.id}"><i class="bi bi-slash-circle"></i> Deactivate</button>
              </div></td>
            </tr>
          `).join("")}</tbody>
        </table>
      </section>
    `;
  }

  renderDirectorTeachers() {
    return `
      <form class="module-card form-grid" id="teacherForm">
        <label><span>Name</span><input id="teacherName" class="form-control" maxlength="120" pattern="[A-Za-zÀ-ÿñÑ\\s'-]+" required></label>
        <label><span>Email</span><input id="teacherEmail" class="form-control" type="email" autocomplete="off" autocapitalize="none" spellcheck="false" required></label>
        <label><span>Branch</span><select id="teacherBranch" class="form-select" data-branch-select></select></label>
        <label>
          <span>Initial password</span>
          <div class="input-group">
            <input id="teacherPassword" class="form-control" type="password" value="ALC2026*" autocomplete="new-password" minlength="8" required>
            <button class="btn btn-outline-secondary password-toggle" type="button" data-password-toggle="teacherPassword" aria-label="Show password">
              <i class="bi bi-eye"></i>
            </button>
          </div>
        </label>
        <button class="btn btn-warning fw-bold full" type="submit"><i class="bi bi-plus-circle"></i> Add teacher</button>
        <p class="notice full" id="teacherMessage"></p>
      </form>
      <section class="module-card table-card">
        <table class="table align-middle">
          <thead><tr><th>Name</th><th>Email</th><th>Branch</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>${this.data.teachers.map((teacher) => `
            <tr>
              <td>${Dom.escape(teacher.name)}</td>
              <td>${Dom.escape(teacher.email)}</td>
              <td>${Dom.escape(this.branchStore.name(teacher.branch_id))}</td>
              <td><span class="${Dom.statusClass(teacher.is_active ? "active" : "inactive")}">${teacher.is_active ? "active" : "inactive"}</span></td>
              <td><button class="btn btn-sm btn-outline-danger" data-disable-teacher="${teacher.id}"><i class="bi bi-slash-circle"></i> Deactivate</button></td>
            </tr>
          `).join("")}</tbody>
        </table>
      </section>
    `;
  }

  renderDirectorPayroll() {
    return `
      ${this.renderMetrics([
        { label: "Teacher hours", value: String(this.data.teacherPayroll.payable_hours || 0) },
        { label: "Estimated pay", value: Formatters.currency(this.data.teacherPayroll.gross_amount || 0) },
        { label: "Late days", value: String(this.data.teacherPayroll.late || 0) },
        { label: "Absences", value: String(this.data.teacherPayroll.absent || 0) }
      ])}
      ${this.renderAttendanceTable(this.data.attendance.filter((record) => record.person_type === "teacher"), true)}
    `;
  }

  renderDirectorPlanning() {
    return `
      <section class="module-card table-card">
        <table class="table align-middle">
          <thead><tr><th>Teacher</th><th>Month</th><th>Level</th><th>Objective</th><th>Document</th><th>Status</th></tr></thead>
          <tbody>${this.data.classPlans.map((plan) => `
            <tr>
              <td>${Dom.escape(plan.teacher_name)}</td>
              <td>${Dom.escape(plan.month)}</td>
              <td>${Dom.escape(plan.level)}</td>
              <td>${Dom.escape(plan.objective)}</td>
              <td>${plan.document_url ? `<a href="${Dom.escape(plan.document_url)}" target="_blank" rel="noreferrer">Open</a>` : "Pending"}</td>
              <td><span class="${Dom.statusClass(plan.status)}">${Dom.escape(plan.status)}</span></td>
            </tr>
          `).join("")}</tbody>
        </table>
      </section>
    `;
  }

  renderDirectorFinance() {
    const reserve = this.data.financeReports.reduce((total, report) => total + Number(report.matrix_share_amount || 0), 0);
    return `
      ${this.renderMetrics([
        { label: "Reports", value: String(this.data.financeReports.length) },
        { label: "Matrix reserve", value: Formatters.currency(reserve) },
        { label: "Branches", value: String(this.branchStore.branches.length) },
        { label: "Style base price", value: "$35" }
      ])}
      <form class="module-card form-grid" id="financeForm">
        <label><span>Branch</span><select id="financeBranch" class="form-select" data-branch-select></select></label>
        <label><span>Income</span><input id="financeIncome" class="form-control" type="number" min="0" value="1200" required></label>
        <label><span>Expenses</span><input id="financeExpenses" class="form-control" type="number" min="0" value="450" required></label>
        <label><span>Matrix %</span><input id="financeShare" class="form-control" type="number" min="0" max="100" value="15" required></label>
        <button class="btn btn-warning fw-bold full" type="submit"><i class="bi bi-save"></i> Save report</button>
      </form>
    `;
  }

  renderDirectorEvents() {
    return `
      <form class="module-card form-grid" id="eventForm">
        <label><span>Client</span><input id="eventClient" class="form-control" required></label>
        <label><span>Event type</span><input id="eventType" class="form-control" required></label>
        <label><span>Date</span><input id="eventDate" class="form-control" type="date" required></label>
        <label><span>B2 dancer</span><input id="eventDancer" class="form-control" placeholder="Valeria Paz" required></label>
        <label><span>Amount</span><input id="eventAmount" class="form-control" type="number" min="0" value="160" required></label>
        <label><span>Deduction</span><input id="eventDeduction" class="form-control" type="number" min="0" value="0" required></label>
        <button class="btn btn-warning fw-bold full" type="submit"><i class="bi bi-calendar-plus"></i> Register B2 event</button>
        <p class="notice full" id="eventMessage"></p>
      </form>
      <section class="module-card table-card">
        <table class="table align-middle">
          <thead><tr><th>Client</th><th>Type</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>${this.data.events.map((event) => `
            <tr><td>${Dom.escape(event.client_name)}</td><td>${Dom.escape(event.event_type)}</td><td>${Dom.escape(event.event_date)}</td><td>${Formatters.currency(event.total_amount)}</td><td><span class="${Dom.statusClass(event.status)}">${Dom.escape(event.status)}</span></td></tr>
          `).join("")}</tbody>
        </table>
      </section>
    `;
  }

  renderAttendanceTable(records, showPay) {
    return `
      <section class="module-card table-card">
        <table class="table align-middle">
          <thead><tr><th>Name</th><th>Date</th><th>Check-in</th><th>Status</th><th>Hours</th>${showPay ? "<th>Pay</th>" : ""}</tr></thead>
          <tbody>${records.length ? records.map((record) => `
            <tr>
              <td>${Dom.escape(record.person_name)}</td>
              <td>${Dom.escape(record.attendance_date)}</td>
              <td>${Dom.escape(Formatters.dateTime(record.check_in_at))}</td>
              <td><span class="${Dom.statusClass(record.status)}">${Dom.escape(record.status)}</span></td>
              <td>${Number(record.duration_hours || 1)}</td>
              ${showPay ? `<td>${["present", "late"].includes(record.status) ? Formatters.currency(Number(record.duration_hours || 1) * Number(record.pay_rate || 12)) : "$0"}</td>` : ""}
            </tr>
          `).join("") : `<tr><td colspan="${showPay ? 6 : 5}">No records found for this month.</td></tr>`}</tbody>
        </table>
      </section>
    `;
  }

  renderAttendanceCalendar(records) {
    const byDate = new Map(records.map((record) => [record.attendance_date, record]));
    const [year, month] = this.selectedMonth().split("-").map(Number);
    const days = new Date(year, month, 0).getDate();

    return `<div class="calendar-grid">${Array.from({ length: days }, (_, index) => {
      const day = String(index + 1).padStart(2, "0");
      const date = `${year}-${String(month).padStart(2, "0")}-${day}`;
      const record = byDate.get(date);
      return `<div class="calendar-day ${record?.status || ""}">
        ${index + 1}
        <small>${record ? Dom.escape(record.status) : "No class"}</small>
      </div>`;
    }).join("")}</div>`;
  }

  scholarshipOptions(selected) {
    return [0, 25, 50, 75, 100].map((value) => (
      `<option value="${value}" ${Number(selected) === value ? "selected" : ""}>${value}%</option>`
    )).join("");
  }

  statusOptions(selected) {
    return ["pending", "active", "inactive"].map((value) => (
      `<option value="${value}" ${selected === value ? "selected" : ""}>${value}</option>`
    )).join("");
  }

  bindRenderedModule() {
    this.bindPasswordToggles();
    this.bindAttendanceForm();
    this.bindClassPlanForm();
    this.bindStudentForm();
    this.bindStudentActions();
    this.bindTeacherForm();
    this.bindTeacherActions();
    this.bindFinanceForm();
    this.bindEventForm();
    this.bindProfilePhotoForm();

    const today = new Date().toISOString().slice(0, 10);
    Dom.setValue("attendanceDate", today);
    Dom.setValue("eventDate", today);
  }

  bindPasswordToggles() {
    document.querySelectorAll("[data-password-toggle]").forEach((button) => {
      if (button.dataset.bound === "true") return;

      button.dataset.bound = "true";
      button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.passwordToggle);
        if (!input) return;

        const visible = input.type === "text";
        input.type = visible ? "password" : "text";
        button.setAttribute("aria-label", visible ? "Show password" : "Hide password");
        button.innerHTML = `<i class="bi ${visible ? "bi-eye" : "bi-eye-slash"}"></i>`;
      });
    });
  }

  bindProfilePhotoForm() {
    const form = document.getElementById("profilePhotoForm");
    const input = document.getElementById("profilePhotoInput");
    const preview = document.getElementById("profilePhotoPreview");
    if (!form || !input) return;

    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      const error = Validators.imageFile(file);
      if (error) {
        Dom.showMessage("profilePhotoMessage", error);
        return;
      }

      const dataUrl = await this.fileToDataUrl(file);
      if (preview) {
        preview.src = dataUrl;
        preview.closest(".profile-photo-preview")?.classList.add("has-image");
      }
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const file = input.files?.[0];
      const error = Validators.imageFile(file);

      if (error) {
        Dom.showMessage("profilePhotoMessage", error);
        return;
      }

      try {
        const photoUrl = await this.fileToDataUrl(file);
        const payload = await this.apiClient.request("/api/me/photo", {
          method: "PATCH",
          body: { photo_url: photoUrl }
        });
        const session = this.sessionStore.get();
        const updatedUser = { ...(session?.user || this.currentUser), ...(payload.user || {}), avatar_url: photoUrl, photo_url: photoUrl };
        this.sessionStore.set({ ...session, user: updatedUser });
        this.currentUser = updatedUser;
        this.data.me = { ...(this.data.me || {}), user: updatedUser, student: payload.student || this.data.me?.student };
        this.renderSessionProfile(this.config.roleLabels[this.currentUser.role] || "School portal");
        Dom.showMessage("profilePhotoMessage", "Profile photo saved.");
      } catch (requestError) {
        Dom.showMessage("profilePhotoMessage", requestError.message);
      }
    });
  }

  fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Profile photo could not be read."));
      reader.readAsDataURL(file);
    });
  }

  validationError(errors) {
    return Object.values(errors).find(Boolean) || "";
  }

  bindAttendanceForm() {
    const form = document.getElementById("attendanceForm");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = {
        branch_id: this.currentUser.branch_id || 1,
        person_type: "student",
        person_name: document.getElementById("attendanceName").value.trim(),
        attendance_date: document.getElementById("attendanceDate").value,
        status: document.getElementById("attendanceStatus").value,
        level: document.getElementById("attendanceLevel").value
      };
      const validationError = this.validationError(Validators.attendanceForm(data));

      if (validationError) {
        Dom.showMessage("attendanceMessage", validationError);
        return;
      }

      try {
        const payload = await this.apiClient.request("/api/attendance-records", {
          method: "POST",
          body: data
        });
        Dom.showMessage("attendanceMessage", `Attendance saved: ${payload.data.evidence_code}.`);
        form.reset();
        Dom.setValue("attendanceDate", new Date().toISOString().slice(0, 10));
      } catch (error) {
        Dom.showMessage("attendanceMessage", error.message);
      }
    });
  }

  bindClassPlanForm() {
    const form = document.getElementById("classPlanForm");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = {
        branch_id: this.currentUser.branch_id || 1,
        teacher_name: document.getElementById("planTeacher").value.trim(),
        month: document.getElementById("planMonth").value,
        level: document.getElementById("planLevel").value,
        objective: document.getElementById("planObjective").value.trim(),
        activities: document.getElementById("planActivities").value.trim(),
        document_url: document.getElementById("planDocumentUrl").value.trim()
      };
      const validationError = this.validationError(Validators.classPlanForm(data));

      if (validationError) {
        Dom.showMessage("planMessage", validationError);
        return;
      }

      try {
        await this.apiClient.request("/api/class-plans", {
          method: "POST",
          body: data
        });
        Dom.showMessage("planMessage", "Planning submitted for director review.");
        await this.reloadData();
      } catch (error) {
        Dom.showMessage("planMessage", error.message);
      }
    });
  }

  bindStudentForm() {
    const form = document.getElementById("studentForm");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = {
        branch_id: Number(document.getElementById("studentBranch").value),
        national_id: Formatters.digitsOnly(document.getElementById("studentNationalId").value),
        full_name: document.getElementById("studentName").value.trim(),
        email: document.getElementById("studentEmail").value.trim().toLowerCase(),
        phone: document.getElementById("studentPhone").value.trim(),
        level: document.getElementById("studentLevel").value,
        scholarship_percent: Number(document.getElementById("studentScholarship").value),
        status: document.getElementById("studentStatus").value
      };
      const validationError = this.validationError(Validators.studentForm(data));

      if (validationError) {
        Dom.showMessage("studentMessage", validationError);
        return;
      }

      try {
        await this.apiClient.request("/api/students", {
          method: "POST",
          body: data
        });
        Dom.showMessage("studentMessage", "Student created.");
        await this.reloadData();
      } catch (error) {
        Dom.showMessage("studentMessage", error.message);
      }
    });
  }

  bindStudentActions() {
    document.querySelectorAll("[data-save-student]").forEach((button) => {
      button.addEventListener("click", () => this.saveStudent(Number(button.dataset.saveStudent)));
    });

    document.querySelectorAll("[data-disable-student]").forEach((button) => {
      button.addEventListener("click", () => this.disableStudent(Number(button.dataset.disableStudent)));
    });
  }

  async saveStudent(studentId) {
    const student = this.data.students.find((item) => Number(item.id) === Number(studentId));
    if (!student) return;
    const data = {
      ...student,
      scholarship_percent: Number(document.querySelector(`[data-student-scholarship="${studentId}"]`).value),
      status: document.querySelector(`[data-student-status="${studentId}"]`).value
    };
    const validationError = this.validationError(Validators.studentForm(data));

    if (validationError) {
      window.alert(validationError);
      return;
    }

    await this.apiClient.request(`/api/students/${studentId}`, {
      method: "PATCH",
      body: data
    });
    await this.reloadData();
  }

  async disableStudent(studentId) {
    await this.apiClient.request(`/api/students/${studentId}`, { method: "DELETE" });
    await this.reloadData();
  }

  bindTeacherForm() {
    const form = document.getElementById("teacherForm");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = {
        name: document.getElementById("teacherName").value.trim(),
        email: document.getElementById("teacherEmail").value.trim().toLowerCase(),
        branch_id: Number(document.getElementById("teacherBranch").value),
        password: document.getElementById("teacherPassword").value
      };
      const validationError = this.validationError(Validators.teacherForm(data));

      if (validationError) {
        Dom.showMessage("teacherMessage", validationError);
        return;
      }

      try {
        await this.apiClient.request("/api/teachers", {
          method: "POST",
          body: data
        });
        Dom.showMessage("teacherMessage", "Teacher created.");
        await this.reloadData();
      } catch (error) {
        Dom.showMessage("teacherMessage", error.message);
      }
    });
  }

  bindTeacherActions() {
    document.querySelectorAll("[data-disable-teacher]").forEach((button) => {
      button.addEventListener("click", async () => {
        await this.apiClient.request(`/api/teachers/${button.dataset.disableTeacher}`, { method: "DELETE" });
        await this.reloadData();
      });
    });
  }

  bindFinanceForm() {
    const form = document.getElementById("financeForm");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = {
        branch_id: Number(document.getElementById("financeBranch").value),
        month: this.selectedMonth(),
        income: Number(document.getElementById("financeIncome").value),
        expenses: Number(document.getElementById("financeExpenses").value),
        matrix_share_percent: Number(document.getElementById("financeShare").value)
      };
      const validationError = this.validationError(Validators.financeForm(data));

      if (validationError) {
        window.alert(validationError);
        return;
      }

      await this.apiClient.request("/api/branch-finance-reports", {
        method: "POST",
        body: data
      });
      await this.reloadData();
    });
  }

  bindEventForm() {
    const form = document.getElementById("eventForm");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = {
        branch_id: this.currentUser.branch_id || 1,
        client_name: document.getElementById("eventClient").value.trim(),
        event_type: document.getElementById("eventType").value.trim(),
        event_date: document.getElementById("eventDate").value,
        dancer_name: document.getElementById("eventDancer").value.trim(),
        total_amount: Number(document.getElementById("eventAmount").value),
        deduction_amount: Number(document.getElementById("eventDeduction").value),
        status: "paid"
      };
      const validationError = this.validationError(Validators.eventForm(data));

      if (validationError) {
        Dom.showMessage("eventMessage", validationError);
        return;
      }

      try {
        const eventPayload = await this.apiClient.request("/api/professional-events", {
          method: "POST",
          body: data
        });

        const dancer = this.findSelectedDancer();
        if (dancer) {
          await this.apiClient.request(`/api/professional-events/${eventPayload.data.id}/assignments`, {
            method: "POST",
            body: {
              student_id: dancer.id,
              gross_amount: data.total_amount,
              deduction_amount: data.deduction_amount,
              payment_status: "paid"
            }
          });
        }

        Dom.showMessage("eventMessage", dancer ? "B2 event registered and assigned." : "Event registered without dancer assignment.");
        await this.reloadData();
      } catch (error) {
        Dom.showMessage("eventMessage", error.message);
      }
    });
  }

  findSelectedDancer() {
    const dancerName = document.getElementById("eventDancer").value.trim().toLowerCase();
    return this.data.students.find((student) => student.level === "B2" && student.full_name.toLowerCase() === dancerName);
  }
}
