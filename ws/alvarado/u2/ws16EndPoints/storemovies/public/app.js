let allRows = [];

loadMovies();

async function loadMovies() {
  showStatus("⏳ Loading movies…", false);
  document.getElementById("movieTable").style.display = "none";

  try {
    const res = await fetch("/storemovies/movies");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const movies = await res.json();
    renderTable(movies);
  } catch (err) {
    showStatus(`❌ Failed to load movies: ${err.message}`, true);
  }
}

async function submitForm() {
  const id       = document.getElementById("fId").value.trim();
  const title    = document.getElementById("fTitle").value.trim();
  const director = document.getElementById("fDirector").value.trim();
  const gender   = document.getElementById("fGender").value.trim();
  const msgEl    = document.getElementById("formMsg");

  if (!id || !title || !director || !gender) {
    show(msgEl, "All four fields are required.", "error");
    return;
  }

  const body = { id: Number(id), title, director, gender };

  try {
    const res = await fetch("/storemovies/movies", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      show(msgEl, data.message || `Error ${res.status}`, "error");
      return;
    }

    show(msgEl, "Movie added successfully.", "success");
    clearForm();
    loadMovies();
  } catch (err) {
    show(msgEl, `Error: ${err.message}`, "error");
  }
}

function clearForm() {
  ["fId", "fTitle", "fDirector", "fGender"].forEach(
    (id) => (document.getElementById(id).value = "")
  );
}

function renderTable(movies) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";
  allRows = [];

  movies.forEach((m) => {
    const tr = document.createElement("tr");
    tr.dataset.search =
      `${m.number} ${m.id} ${m.title} ${m.director} ${m.gender}`.toLowerCase();

    tr.innerHTML = `
      <td class="num-cell">${m.number}</td>
      <td class="id-cell">${m.id ?? "—"}</td>
      <td class="title-cell">${escHtml(m.title)}</td>
      <td class="director-cell">${escHtml(m.director)}</td>
      <td class="genre-cell">${escHtml(m.gender)}</td>
    `;
    tbody.appendChild(tr);
    allRows.push(tr);
  });

  showStatus("", false);
  document.getElementById("movieTable").style.display = "table";
  updateCount(movies.length, movies.length);
}

function filterTable() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  let visible = 0;

  allRows.forEach((tr) => {
    const match = !query || tr.dataset.search.includes(query);
    tr.style.display = match ? "" : "none";
    if (match) visible++;
  });

  document.getElementById("noResults").style.display =
    visible === 0 ? "block" : "none";

  updateCount(visible, allRows.length);
}

function updateCount(visible, total) {
  document.getElementById("countBadge").textContent =
    visible === total
      ? `${total} movie${total !== 1 ? "s" : ""}`
      : `${visible} of ${total} movies`;
}

function showStatus(msg, isError) {
  const el = document.getElementById("statusMsg");
  el.textContent = msg;
  el.className   = isError ? "error" : "";
  el.style.display = msg ? "block" : "none";
}

function show(el, html, type) {
  el.innerHTML     = html;
  el.className     = `form-msg ${type}`;
  el.style.display = "block";
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
