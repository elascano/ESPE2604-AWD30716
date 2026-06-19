class PublicPagesController {
  constructor(apiClient, sessionStore, branchStore) {
    this.apiClient = apiClient;
    this.sessionStore = sessionStore;
    this.branchStore = branchStore;
    this.pendingCredential = null;
    this.pendingGoogleData = null;
  }

  init() {
    this.initPasswordToggles();
    this.initEnrollmentPage();
    this.initLoginPage();
    this.initTeacherKioskPage();
    this.initGoogleSignIn();
  }

  initPasswordToggles() {
    document.querySelectorAll("[data-password-toggle]").forEach((button) => {
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

  initEnrollmentPage() {
    const form = document.getElementById("enrollmentForm");
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("style")) this.setSelectByText("enrollStyle", params.get("style"));
    if (params.get("offer")) Dom.setValue("enrollOffer", params.get("offer"));

    const isGoogleFlow = params.get("google") === "1";
    const googleCredential = window.sessionStorage.getItem("alc-google-credential");

    if (isGoogleFlow && googleCredential) {
      const googleName = params.get("name") || "";
      const googleEmail = params.get("email") || "";

      const nameInput = document.getElementById("enrollName");
      const emailInput = document.getElementById("enrollEmail");
      if (nameInput) { nameInput.value = googleName; nameInput.readOnly = true; nameInput.classList.add("readonly-field"); }
      if (emailInput) { emailInput.value = googleEmail; emailInput.readOnly = true; emailInput.classList.add("readonly-field"); }

      const hiddenField = document.getElementById("enrollGoogleCredential");
      if (hiddenField) hiddenField.value = googleCredential;

      const heroDesc = document.getElementById("enrollmentHeroText");
      if (heroDesc) heroDesc.textContent = "Complete your information to create your student account.";
      const sidebarText = document.getElementById("enrollmentSidebarText");
      if (sidebarText) sidebarText.textContent = "You signed in with Google. Fill in the remaining details to create your student account.";
      const sidebarList = document.getElementById("enrollmentSidebarList");
      if (sidebarList) sidebarList.innerHTML = "<span>Google account verified</span><span>Access immediately after registering</span>";
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const styleEl = document.getElementById("enrollStyle");
      const levelEl = document.getElementById("enrollLevel");

      const notes = [
        `Preferred style: ${styleEl.options[styleEl.selectedIndex]?.text || ""}`,
        `Selected offer: ${document.getElementById("enrollOffer").value || "None"}`,
        document.getElementById("enrollNotes").value.trim()
      ].filter(Boolean).join("\n");

      const data = {
        branch_id: Number(document.getElementById("enrollBranch").value),
        national_id: Formatters.digitsOnly(document.getElementById("enrollNationalId").value),
        full_name: document.getElementById("enrollName").value.trim(),
        email: document.getElementById("enrollEmail").value.trim().toLowerCase(),
        phone: document.getElementById("enrollPhone").value.trim(),
        level: levelEl.options[levelEl.selectedIndex]?.text || "",
        scholarship_percent: 0,
        guardian_name: document.getElementById("enrollGuardian").value.trim(),
        guardian_phone: document.getElementById("enrollGuardianPhone").value.trim(),
        comments: notes
      };

      const errors = Validators.enrollmentForm(data);
      if (this.showFieldErrors(errors)) {
        Dom.showMessage("enrollmentMessage", "Please fix the highlighted fields before submitting.");
        return;
      }

      const credential = document.getElementById("enrollGoogleCredential")?.value
        || window.sessionStorage.getItem("alc-google-credential");

      try {
        if (credential) {
          const payload = await this.apiClient.request("/api/auth/google/enroll", {
            method: "POST",
            auth: false,
            body: { ...data, id_token: credential }
          });

          window.sessionStorage.removeItem("alc-google-credential");
          if (document.getElementById("enrollGoogleCredential")) {
            document.getElementById("enrollGoogleCredential").value = "";
          }
          this.sessionStore.set(payload);
          Dom.showMessage("enrollmentMessage", "Account created. Redirecting...");
          window.setTimeout(() => { window.location.replace("dashboard.html"); }, 1000);
        } else {
          await this.apiClient.request("/api/enrollments", {
            method: "POST",
            auth: false,
            body: data
          });

          form.reset();
          this.branchStore.fillSelects();
          this.branchStore.fillStyleSelects();
          this.branchStore.fillLevelSelects();
          Dom.showMessage("enrollmentMessage", "Request submitted. The directors will contact the applicant.");
        }
      } catch (error) {
        Dom.showMessage("enrollmentMessage", error.message);
      }
    });
  }

  setSelectByText(id, text) {
    const select = document.getElementById(id);
    if (!select) return;
    for (const option of select.options) {
      if (option.text === text || option.text.trim() === text.trim()) {
        select.value = option.value;
        break;
      }
    }
  }

  showFieldErrors(errors) {
    const fieldMap = {
      full_name: "enrollName",
      email: "enrollEmail",
      national_id: "enrollNationalId",
      phone: "enrollPhone",
      guardian_name: "enrollGuardian",
      guardian_phone: "enrollGuardianPhone"
    };
    let hasErrors = false;

    Object.entries(fieldMap).forEach(([key, fieldId]) => {
      const input = document.getElementById(fieldId);
      const errorElement = document.getElementById(`${fieldId}Error`);
      const message = errors[key] || "";

      if (errorElement) errorElement.textContent = message;
      if (input) input.classList.toggle("input-error", !!message);
      if (message) hasErrors = true;
    });

    return hasErrors;
  }

  initLoginPage() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    const clearLoginFields = () => {
      form.reset();
      Dom.setValue("loginEmail", "");
      Dom.setValue("loginPassword", "");
    };

    window.addEventListener("pageshow", () => {
      if (this.sessionStore.get()?.token) {
        window.location.replace("dashboard.html");
        return;
      }

      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }

      clearLoginFields();
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      try {
        const roleEl = document.getElementById("loginRole");
        const payload = await this.apiClient.request("/api/auth/login", {
          method: "POST",
          auth: false,
          body: {
            email: document.getElementById("loginEmail").value.trim().toLowerCase(),
            password: document.getElementById("loginPassword").value,
            role: roleEl ? roleEl.value : ""
          }
        });

        this.sessionStore.set(payload);
        clearLoginFields();
        window.location.replace("dashboard.html");
      } catch (error) {
        Dom.setValue("loginPassword", "");
        Dom.showMessage("loginMessage", error.message);
      }
    });

    const createModal = document.getElementById("createAccountModal");
    if (createModal) {
      const confirmBtn = document.getElementById("createAccountConfirm");
      if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {
          if (!this.pendingCredential) return;

          const modal = bootstrap.Modal.getInstance(createModal);
          if (modal) modal.hide();

          window.sessionStorage.setItem("alc-google-credential", this.pendingCredential);
          const data = this.pendingGoogleData || { name: "", email: "" };
          this.pendingCredential = null;
          this.pendingGoogleData = null;

          const params = new URLSearchParams({
            google: "1",
            name: data.name,
            email: data.email
          });
          window.location.href = `enrollment.html?${params.toString()}`;
        });
      }
    }
  }

  initGoogleSignIn() {
    if (!document.getElementById("googleSignInButton")) return;

    const tryInit = () => {
      if (!window.google?.accounts?.id) {
        setTimeout(tryInit, 300);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: window.GOOGLE_CLIENT_ID || "",
        callback: (response) => this.handleGoogleCredential(response.credential),
        cancel_on_tap_outside: false
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInButton"),
        { theme: "outline", size: "large", text: "signin_with", shape: "rectangular", width: 300 }
      );
    };

    tryInit();
  }

  async handleGoogleCredential(credential) {
    try {
      const payload = await this.apiClient.request("/api/auth/google", {
        method: "POST",
        auth: false,
        body: { id_token: credential }
      });

      if (payload.user_exists === false) {
        this.pendingCredential = credential;
        this.pendingGoogleData = { name: payload.name, email: payload.email };
        const msgEl = document.getElementById("createAccountMessage");
        if (msgEl) {
          msgEl.textContent = `"${payload.email}" is not registered in the system.`;
        }
        const modal = new bootstrap.Modal("#createAccountModal");
        modal.show();
        return;
      }

      this.sessionStore.set(payload);
      window.location.replace("dashboard.html");
    } catch (error) {
      Dom.showMessage("googleMessage", error.message);
    }
  }

  initTeacherKioskPage() {
    const form = document.getElementById("teacherKioskForm");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = {
        email: document.getElementById("teacherKioskEmail").value.trim().toLowerCase(),
        branch_id: Number(document.getElementById("teacherKioskBranch").value),
        expected_start_time: document.getElementById("teacherExpectedStart").value,
        duration_hours: Number(document.getElementById("teacherDurationHours").value),
        style: document.getElementById("teacherKioskStyle").value
      };
      const validationError = Object.values(Validators.teacherKioskForm(data)).find(Boolean);

      if (validationError) {
        Dom.showMessage("teacherKioskMessage", validationError);
        return;
      }

      try {
        const payload = await this.apiClient.request("/api/teacher-attendance/check-in", {
          method: "POST",
          auth: false,
          body: data
        });

        Dom.showMessage("teacherKioskMessage", `${payload.message} Code: ${payload.data.evidence_code}.`);
        form.reset();
        this.branchStore.fillSelects();
        Dom.setValue("teacherExpectedStart", "18:00");
        Dom.setValue("teacherDurationHours", "1");
      } catch (error) {
        Dom.showMessage("teacherKioskMessage", error.message);
      }
    });
  }
}
