document.addEventListener("DOMContentLoaded", async () => {
  const config = new AppConfig();
  const endpoint = "/api/student-showcase";
  const apiUrl = `${config.apiBase}${endpoint}`;

  const elements = {
    name: document.getElementById("studentName"),
    summary: document.getElementById("studentSummary"),
    uri: document.getElementById("studentUri"),
    initials: document.getElementById("studentInitials"),
    panelName: document.getElementById("studentPanelName"),
    status: document.getElementById("studentStatus"),
    level: document.getElementById("studentLevel"),
    branch: document.getElementById("studentBranch"),
    scholarship: document.getElementById("studentScholarship"),
    comments: document.getElementById("studentComments"),
    exportPdf: document.getElementById("exportStudentPdf")
  };

  elements.uri.textContent = apiUrl;
  let currentStudent = null;

  try {
    const response = await fetch(apiUrl, { headers: { Accept: "application/json" } });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message || "The student profile could not be loaded.");
    }

    currentStudent = normalizeStudent(payload.data);
    renderStudent(currentStudent, elements);
    elements.exportPdf.disabled = false;
  } catch (error) {
    renderError(error, elements);
  }

  elements.exportPdf.addEventListener("click", () => {
    if (!currentStudent) return;
    exportStudentPdf(currentStudent, apiUrl);
  });
});

function renderStudent(student, elements) {
  elements.name.textContent = student.name;
  elements.summary.textContent = `${student.name} trains at ${student.branch}, currently working in ${student.level} with an active academy profile.`;
  elements.initials.textContent = initialsFor(student.name);
  elements.panelName.textContent = student.name;
  elements.status.textContent = student.status;
  elements.level.textContent = student.level;
  elements.branch.textContent = student.branch;
  elements.scholarship.textContent = student.scholarship;
  elements.comments.textContent = student.comments;
}

function renderError(error, elements) {
  elements.name.textContent = "Backend connection pending";
  elements.summary.textContent = error.message;
  elements.panelName.textContent = "Student unavailable";
  elements.status.textContent = "Review API";
  elements.level.textContent = "--";
  elements.branch.textContent = "--";
  elements.scholarship.textContent = "--";
  elements.comments.textContent = "Check that the backend EC2 is running, port 8080 is open, and Supabase credentials are configured.";
  elements.exportPdf.disabled = true;
}

function normalizeStudent(student) {
  const scholarshipPercent = Number.isFinite(Number(student.scholarship_percent))
    ? Number(student.scholarship_percent)
    : 0;

  return {
    id: student.id || "",
    name: student.full_name || "American Latin Class student",
    level: student.level || "Level",
    branch: student.branch || "Academy branch",
    scholarship: `${scholarshipPercent}%`,
    scholarshipPercent,
    status: student.status || "active",
    comments: student.comments || "This public profile is served by the backend API for the AWS two-instance deployment demo.",
    schedule: Array.isArray(student.schedule) ? student.schedule : [],
    attendanceSummary: student.attendance_summary || null
  };
}

function exportStudentPdf(student, apiUrl) {
  const jsPdf = window.jspdf?.jsPDF;
  if (!jsPdf) {
    alert("PDF export library is still loading. Please try again in a moment.");
    return;
  }

  const doc = new jsPdf({ unit: "pt", format: "a4" });
  const generatedAt = new Date().toLocaleString();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;

  doc.setFillColor(26, 28, 35);
  doc.rect(0, 0, pageWidth, 140, "F");
  doc.setFillColor(255, 216, 77);
  doc.roundedRect(margin, 36, 54, 54, 8, 8, "F");
  doc.setTextColor(26, 28, 35);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text(initialsFor(student.name), margin + 14, 70);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.text("American Latin Class", margin + 72, 55);
  doc.setFontSize(28);
  doc.text("Student Report", margin + 72, 88);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated: ${generatedAt}`, margin + 72, 110);

  doc.setTextColor(37, 40, 47);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(student.name, margin, 190);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(112, 122, 132);
  doc.text("Public student profile exported from the AWS frontend using the backend student URI.", margin, 212);

  const rows = [
    ["Student ID", String(student.id || "N/A")],
    ["Level", student.level],
    ["Branch", student.branch],
    ["Scholarship", student.scholarship],
    ["Status", student.status],
    ["Attendance", formatAttendance(student.attendanceSummary)],
    ["Backend URI", apiUrl]
  ];

  let y = 258;
  rows.forEach(([label, value]) => {
    doc.setFillColor(245, 246, 248);
    doc.roundedRect(margin, y - 18, contentWidth, 42, 6, 6, "F");
    doc.setTextColor(112, 122, 132);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(label.toUpperCase(), margin + 14, y);
    doc.setTextColor(37, 40, 47);
    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(value, contentWidth - 158), margin + 150, y);
    y += 54;
  });

  doc.setTextColor(37, 40, 47);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("Notes", margin, y + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(112, 122, 132);
  doc.text(doc.splitTextToSize(student.comments, contentWidth), margin, y + 38);

  if (student.schedule.length > 0) {
    y += 112;
    doc.setTextColor(37, 40, 47);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("Schedule", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(112, 122, 132);
    doc.text(doc.splitTextToSize(student.schedule.join("\n"), contentWidth), margin, y + 24);
  }

  doc.setDrawColor(223, 227, 232);
  doc.line(margin, 760, pageWidth - margin, 760);
  doc.setFontSize(10);
  doc.text("American Latin Class - AWS two-instance deployment evidence", margin, 782);

  doc.save(`student-report-${slugify(student.name)}.pdf`);
}

function initialsFor(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "ALC";
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "student";
}

function formatAttendance(summary) {
  if (!summary) return "N/A";

  const percent = summary.attendance_percent ?? "N/A";
  return `${percent}% attendance (${summary.present ?? 0} present, ${summary.late ?? 0} late, ${summary.absent ?? 0} absent)`;
}
