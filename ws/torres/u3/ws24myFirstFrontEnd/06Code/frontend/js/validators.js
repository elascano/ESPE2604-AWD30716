class Validators {
  static name(value) {
    const trimmed = (value || "").trim();
    if (!trimmed) return "Full name is required.";
    if (!/^[\p{L}\s'-]+$/u.test(trimmed)) return "Full name must contain only letters.";
    if (trimmed.length < 2) return "Full name must be at least 2 characters.";
    if (trimmed.length > 120) return "Full name must not exceed 120 characters.";
    return "";
  }

  static email(value) {
    const trimmed = (value || "").trim().toLowerCase();
    if (!trimmed) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Enter a valid email address.";
    return "";
  }

  static ecuadorianId(value) {
    const cleaned = (value || "").replace(/\D+/g, "");
    if (!cleaned) return "National ID is required.";
    if (!/^\d{10}$/.test(cleaned)) return "National ID must be exactly 10 digits.";

    const province = parseInt(cleaned.substring(0, 2), 10);
    if (province < 1 || province > 24) return "Invalid national ID: province code is out of range.";

    const thirdDigit = parseInt(cleaned[2], 10);
    if (thirdDigit > 5) return "Invalid national ID.";

    const digits = cleaned.split("").map(Number);
    const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      let product = digits[i] * coefficients[i];
      if (product >= 10) product -= 9;
      sum += product;
    }

    const calculatedCheck = (10 - (sum % 10)) % 10;
    if (calculatedCheck !== digits[9]) return "Invalid national ID: check digit does not match.";

    return "";
  }

  static phone(value) {
    const cleaned = (value || "").replace(/\D+/g, "");
    if (!cleaned) return "Phone is required.";
    if (cleaned.length < 7 || cleaned.length > 15) return "Phone must be between 7 and 15 digits.";
    return "";
  }

  static guardianName(value) {
    const trimmed = (value || "").trim();
    if (!trimmed) return "";
    if (!/^[\p{L}\s'-]+$/u.test(trimmed)) return "Guardian name must contain only letters.";
    return "";
  }

  static guardianPhone(value) {
    const cleaned = (value || "").replace(/\D+/g, "");
    if (!cleaned) return "";
    if (cleaned.length < 7 || cleaned.length > 15) return "Guardian phone must be between 7 and 15 digits.";
    return "";
  }

  static enrollmentForm(data) {
    return {
      full_name: Validators.name(data.full_name),
      email: Validators.email(data.email),
      national_id: Validators.ecuadorianId(data.national_id),
      phone: Validators.phone(data.phone),
      guardian_name: Validators.guardianName(data.guardian_name),
      guardian_phone: Validators.guardianPhone(data.guardian_phone)
    };
  }

  static password(value, required = true) {
    if (!value && !required) return "";
    if (!value) return "Password is required.";
    if (String(value).length < 8) return "Password must be at least 8 characters.";
    return "";
  }

  static url(value) {
    const trimmed = (value || "").trim();
    if (!trimmed) return "";

    try {
      const parsed = new URL(trimmed);
      return ["http:", "https:"].includes(parsed.protocol) ? "" : "URL must start with http or https.";
    } catch {
      return "Enter a valid URL.";
    }
  }

  static required(value, label) {
    return String(value ?? "").trim() ? "" : `${label} is required.`;
  }

  static option(value, allowed, label) {
    return allowed.includes(String(value)) ? "" : `${label} has an invalid value.`;
  }

  static numberRange(value, min, max, label) {
    const number = Number(value);
    if (!Number.isFinite(number)) return `${label} must be a number.`;
    if (number < min || number > max) return `${label} must be between ${min} and ${max}.`;
    return "";
  }

  static imageFile(file) {
    if (!file) return "Choose a profile photo.";
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      return "Profile photo must be PNG, JPEG, or WEBP.";
    }
    if (file.size > 900000) return "Profile photo must be smaller than 900 KB.";
    return "";
  }

  static studentForm(data) {
    return {
      full_name: Validators.name(data.full_name),
      email: Validators.email(data.email),
      national_id: Validators.ecuadorianId(data.national_id),
      phone: Validators.phone(data.phone),
      branch_id: Validators.numberRange(data.branch_id, 1, 9999, "Branch"),
      level: Validators.option(data.level, ["B1", "B2"], "Level"),
      scholarship_percent: Validators.option(String(data.scholarship_percent), ["0", "25", "50", "75", "100"], "Scholarship"),
      status: Validators.option(data.status, ["pending", "active", "inactive"], "Status")
    };
  }

  static teacherForm(data) {
    return {
      name: Validators.name(data.name),
      email: Validators.email(data.email),
      branch_id: Validators.numberRange(data.branch_id, 1, 9999, "Branch"),
      password: Validators.password(data.password)
    };
  }

  static teacherKioskForm(data) {
    return {
      email: Validators.email(data.email),
      branch_id: Validators.numberRange(data.branch_id, 1, 9999, "Branch"),
      expected_start_time: /^\d{2}:\d{2}$/.test(data.expected_start_time || "") ? "" : "Expected start time is required.",
      duration_hours: Validators.numberRange(data.duration_hours, 0.25, 8, "Class hours"),
      style: Validators.required(data.style, "Style")
    };
  }

  static attendanceForm(data) {
    return {
      person_name: Validators.name(data.person_name),
      attendance_date: Validators.required(data.attendance_date, "Date"),
      status: Validators.option(data.status, ["present", "late", "absent", "excused"], "Status"),
      level: Validators.option(data.level, ["B1", "B2"], "Level")
    };
  }

  static classPlanForm(data) {
    return {
      teacher_name: Validators.name(data.teacher_name),
      month: /^\d{4}-\d{2}$/.test(data.month || "") ? "" : "Month is required.",
      level: Validators.option(data.level, ["B1", "B2"], "Level"),
      objective: Validators.required(data.objective, "Objective"),
      activities: Validators.required(data.activities, "Activities"),
      document_url: Validators.url(data.document_url)
    };
  }

  static financeForm(data) {
    return {
      branch_id: Validators.numberRange(data.branch_id, 1, 9999, "Branch"),
      income: Validators.numberRange(data.income, 0, 999999, "Income"),
      expenses: Validators.numberRange(data.expenses, 0, 999999, "Expenses"),
      matrix_share_percent: Validators.numberRange(data.matrix_share_percent, 0, 100, "Matrix percent")
    };
  }

  static eventForm(data) {
    return {
      client_name: Validators.required(data.client_name, "Client"),
      event_type: Validators.required(data.event_type, "Event type"),
      event_date: Validators.required(data.event_date, "Date"),
      dancer_name: Validators.name(data.dancer_name),
      total_amount: Validators.numberRange(data.total_amount, 0, 999999, "Amount"),
      deduction_amount: Validators.numberRange(data.deduction_amount, 0, 999999, "Deduction")
    };
  }
}
