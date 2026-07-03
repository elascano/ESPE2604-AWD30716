document.addEventListener("DOMContentLoaded", async () => {
  const config = new AppConfig();
  const endpoint = "/api/students-showcase";
  const apiUrl = `${config.apiBase}${endpoint}`;
  const elements = {
    uri: document.getElementById("studentsUri"),
    summary: document.getElementById("studentsSummary"),
    title: document.getElementById("studentsTitle"),
    count: document.getElementById("studentsCount"),
    grid: document.getElementById("studentsGrid"),
    message: document.getElementById("studentsMessage"),
    exportPdf: document.getElementById("exportStudentsPdf")
  };

  elements.uri.textContent = apiUrl;
  let students = [];

  try {
    const response = await fetch(apiUrl, { headers: { Accept: "application/json" } });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message || "The student roster could not be loaded.");
    }

    students = payload.data.map(normalizeStudent);
    renderStudents(students, elements);
    elements.exportPdf.disabled = students.length === 0;
  } catch (error) {
    renderError(error, elements);
  }

  elements.exportPdf.addEventListener("click", () => {
    if (students.length === 0) return;
    exportStudentsPdf(students, apiUrl);
  });
});

function renderStudents(students, elements) {
  elements.summary.textContent = `${students.length} active students loaded from MongoDB.`;
  elements.title.textContent = "Active students";
  elements.count.textContent = `${students.length} students`;
  elements.message.textContent = "";
  elements.grid.innerHTML = students.map(studentCard).join("");
}

function studentCard(student) {
  return `
    <article class="student-list-card">
      <div class="student-list-avatar">${initialsFor(student.name)}</div>
      <div>
        <h3>${escapeHtml(student.name)}</h3>
        <p>${escapeHtml(student.comments)}</p>
      </div>
      <div class="student-list-facts">
        <span><strong>${escapeHtml(student.level)}</strong> Level</span>
        <span><strong>${escapeHtml(student.branch)}</strong> Branch</span>
        <span><strong>${escapeHtml(student.scholarship)}</strong> Scholarship</span>
        <span><strong>${escapeHtml(formatAttendanceShort(student.attendanceSummary))}</strong> Attendance</span>
      </div>
    </article>
  `;
}

function renderError(error, elements) {
  elements.summary.textContent = error.message;
  elements.title.textContent = "Student list unavailable";
  elements.count.textContent = "Review API";
  elements.grid.innerHTML = "";
  elements.message.textContent = "Check that the backend EC2 is running on port 8080 and that CORS allows this frontend.";
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
    status: student.status || "active",
    comments: student.comments || "No comments registered.",
    schedule: Array.isArray(student.schedule) ? student.schedule : [],
    attendanceSummary: student.attendance_summary || null
  };
}

function exportStudentsPdf(students, apiUrl) {
  const jsPdf = window.jspdf?.jsPDF;
  if (!jsPdf) {
    alert("PDF export library is still loading. Please try again in a moment.");
    return;
  }

  const doc = new jsPdf({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 44;
  const contentWidth = pageWidth - margin * 2;
  const generatedAt = new Date().toLocaleString();

  drawHeader(doc, pageWidth, margin, "All Students Report", generatedAt);

  let y = 170;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(37, 40, 47);
  doc.text(`Active students: ${students.length}`, margin, y);
  y += 30;

  students.forEach((student, index) => {
    if (y > 690) {
      doc.addPage();
      drawHeader(doc, pageWidth, margin, "All Students Report", generatedAt);
      y = 170;
    }

    doc.setFillColor(245, 246, 248);
    doc.roundedRect(margin, y - 16, contentWidth, 112, 8, 8, "F");
    doc.setTextColor(37, 40, 47);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(`${index + 1}. ${student.name}`, margin + 14, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(112, 122, 132);
    doc.text(`Level: ${student.level}`, margin + 14, y + 30);
    doc.text(`Branch: ${student.branch}`, margin + 130, y + 30);
    doc.text(`Scholarship: ${student.scholarship}`, margin + 260, y + 30);
    doc.text(`Attendance: ${formatAttendance(student.attendanceSummary)}`, margin + 14, y + 54);
    doc.text(doc.splitTextToSize(student.comments, contentWidth - 28), margin + 14, y + 78);
    y += 130;
  });

  doc.setFontSize(10);
  doc.setTextColor(112, 122, 132);
  doc.text(`Backend URI: ${apiUrl}`, margin, 782);
  doc.save("all-students-report.pdf");
}

function drawHeader(doc, pageWidth, margin, title, generatedAt) {
  doc.setFillColor(26, 28, 35);
  doc.rect(0, 0, pageWidth, 128, "F");
  doc.setFillColor(255, 216, 77);
  doc.roundedRect(margin, 34, 50, 50, 8, 8, "F");
  doc.setTextColor(26, 28, 35);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("ALC", margin + 11, 65);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.text("American Latin Class", margin + 68, 52);
  doc.setFontSize(25);
  doc.text(title, margin + 68, 84);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated: ${generatedAt}`, margin + 68, 105);
}

function initialsFor(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "ALC";
}

function formatAttendance(summary) {
  if (!summary) return "N/A";
  const percent = summary.attendance_percent ?? "N/A";
  return `${percent}% (${summary.present ?? 0} present, ${summary.late ?? 0} late, ${summary.absent ?? 0} absent)`;
}

function formatAttendanceShort(summary) {
  if (!summary) return "N/A";
  return `${summary.attendance_percent ?? "N/A"}%`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
