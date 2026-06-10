const state = {
  students: [],
  filteredStudents: [],
};

const elements = {
  averageGrade: document.getElementById("averageGrade"),
  body: document.getElementById("studentsTableBody"),
  emptyState: document.getElementById("emptyState"),
  errorMessage: document.getElementById("errorMessage"),
  expectedRevenue: document.getElementById("expectedRevenue"),
  loadingState: document.getElementById("loadingState"),
  refreshButton: document.getElementById("refreshButton"),
  resultCount: document.getElementById("resultCount"),
  searchInput: document.getElementById("searchInput"),
  tableContainer: document.getElementById("tableContainer"),
  totalStudents: document.getElementById("totalStudents"),
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatMoney(value) {
  return Number(value).toLocaleString("es-EC", {
    style: "currency",
    currency: "USD",
  });
}

function setLoading(isLoading) {
  elements.loadingState.classList.toggle("d-none", !isLoading);
  elements.refreshButton.disabled = isLoading;
}

function setError(message) {
  elements.errorMessage.textContent = message;
  elements.errorMessage.classList.toggle("d-none", !message);
}

async function getJson(uri) {
  const response = await fetch(uri);

  if (!response.ok) {
    throw new Error(`Error ${response.status}: no se pudo consultar ${uri}`);
  }

  return response.json();
}

function updateSummary(summary) {
  elements.totalStudents.textContent = summary.totalEstudiantes;
  elements.averageGrade.textContent = summary.promedioGeneral;
  elements.expectedRevenue.textContent = formatMoney(summary.recaudacionEsperada);
}

function renderTable() {
  elements.body.innerHTML = state.filteredStudents
    .map((student) => `
      <tr>
        <td class="student-id">${escapeHtml(student.id)}</td>
        <td class="student-name">${escapeHtml(student.name)}</td>
        <td>${escapeHtml(student.descripcion)}</td>
        <td>${escapeHtml(student.edad)}</td>
        <td><span class="badge text-bg-success">${escapeHtml(student.promedio)}</span></td>
        <td>${escapeHtml(formatMoney(student.valorPagarSemestre))}</td>
        <td>
          <a class="btn btn-sm btn-outline-dark" href="/api/students/${escapeHtml(student.id)}/report/excel">
            <i class="bi bi-file-earmark-text" aria-hidden="true"></i>
            Excel
          </a>
        </td>
      </tr>
    `)
    .join("");

  const hasResults = state.filteredStudents.length > 0;
  elements.tableContainer.classList.toggle("d-none", !hasResults);
  elements.emptyState.classList.toggle("d-none", hasResults);
  elements.resultCount.textContent = `${state.filteredStudents.length} resultados`;
}

function filterStudents() {
  const term = elements.searchInput.value.trim().toLowerCase();

  state.filteredStudents = state.students.filter((student) => {
    const text = [student.id, student.name, student.descripcion, student.promedio]
      .join(" ")
      .toLowerCase();

    return text.includes(term);
  });

  renderTable();
}

async function loadStudents() {
  setLoading(true);
  setError("");

  try {
    const [students, summary] = await Promise.all([
      getJson("/api/students"),
      getJson("/api/reports/summary"),
    ]);

    state.students = students;
    state.filteredStudents = [...students];
    updateSummary(summary);
    filterStudents();
  } catch (error) {
    state.students = [];
    state.filteredStudents = [];
    renderTable();
    setError(error.message);
  } finally {
    setLoading(false);
  }
}

elements.searchInput.addEventListener("input", filterStudents);
elements.refreshButton.addEventListener("click", loadStudents);

loadStudents();
