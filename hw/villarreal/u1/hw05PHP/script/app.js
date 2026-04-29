var branchClasses = {
  Matriz: "matriz",
  Norte: "norte",
  Quitumbe: "quitumbe",
  Tumbaco: "tumbaco",
  Conocoto: "conocoto"
};

var config = window.SUPABASE_CONFIG || {};
var isSupabaseReady = config.url &&
  config.anonKey &&
  config.url.indexOf("TU-PROYECTO") === -1 &&
  config.anonKey.indexOf("TU_ANON_KEY") === -1;

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function branchBadge(branch) {
  return '<span class="branch-pill ' + branchClasses[branch] + '">' + escapeHtml(branch) + '</span>';
}

function paymentStatusBadge(status) {
  var className = "paid";

  if (status === "Atrasado") {
    className = "late";
  }

  if (status === "Becado/Convenio") {
    className = "grant";
  }

  return '<span class="status ' + className + '">' + escapeHtml(status) + '</span>';
}

function setMessage(id, text, type) {
  var message = document.getElementById(id);

  if (message) {
    message.textContent = text;
    message.className = "notice " + (type || "");
  }
}

function setTableMessage(tableId, columns, message) {
  var table = document.getElementById(tableId);

  if (table) {
    table.innerHTML = '<tr><td colspan="' + columns + '" class="table-message">' + escapeHtml(message) + '</td></tr>';
  }
}

function renderRows(tableId, rows, columns, emptyMessage) {
  var table = document.getElementById(tableId);

  if (!table) {
    return;
  }

  table.innerHTML = "";

  if (!rows.length) {
    setTableMessage(tableId, columns, emptyMessage);
    return;
  }

  rows.forEach(function (rowCells) {
    addRow(tableId, rowCells);
  });
}

function addRow(tableId, cells) {
  var table = document.getElementById(tableId);
  var row = document.createElement("tr");

  cells.forEach(function (cell) {
    var td = document.createElement("td");
    td.innerHTML = cell;
    row.appendChild(td);
  });

  table.appendChild(row);
}

function makeEvidenceCode() {
  return "QR-ALC-" + Math.floor(1000 + Math.random() * 9000);
}

function supabaseRequest(table, query, method, body) {
  var endpoint = config.url.replace(/\/$/, "") + "/rest/v1/" + table + (query || "");
  var options = {
    method: method || "GET",
    headers: {
      apikey: config.anonKey,
      Authorization: "Bearer " + config.anonKey,
      "Content-Type": "application/json"
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
    options.headers.Prefer = "return=representation";
  }

  return fetch(endpoint, options).then(function (response) {
    if (!response.ok) {
      return response.text().then(function (text) {
        throw new Error(text || "Error al conectar con Supabase");
      });
    }

    return response.json();
  });
}

function requireSupabase(tableId, columns, messageId) {
  if (isSupabaseReady) {
    return true;
  }

  setTableMessage(tableId, columns, "Configura Supabase para cargar datos desde la nube.");
  setMessage(
    messageId,
    "Falta editar script/supabase-config.js con tu SUPABASE_URL y SUPABASE_ANON_KEY.",
    "warning"
  );
  return false;
}

function loadStudents() {
  if (!requireSupabase("studentsTable", 6, "studentMessage")) {
    return;
  }

  setTableMessage("studentsTable", 6, "Cargando alumnos desde Supabase...");

  supabaseRequest("alumnos", "?select=nombre,sede,clase_nivel,estado,beca_convenio,telefono&order=created_at.desc")
    .then(function (records) {
      renderRows("studentsTable", records.map(function (student) {
        return [
          escapeHtml(student.nombre),
          branchBadge(student.sede),
          escapeHtml(student.clase_nivel),
          escapeHtml(student.estado),
          escapeHtml(student.beca_convenio),
          escapeHtml(student.telefono)
        ];
      }), 6, "No hay alumnos registrados.");
      setMessage("studentMessage", "Datos cargados desde Supabase.", "success");
    })
    .catch(function (error) {
      setTableMessage("studentsTable", 6, "No se pudieron cargar los alumnos.");
      setMessage("studentMessage", error.message, "error");
    });
}

function loadPayments() {
  if (!requireSupabase("paymentsTable", 6, "paymentMessage")) {
    return;
  }

  setTableMessage("paymentsTable", 6, "Cargando mensualidades desde Supabase...");

  supabaseRequest("mensualidades", "?select=alumno,sede,periodo,monto,estado_pago,recibo&order=created_at.desc")
    .then(function (records) {
      renderRows("paymentsTable", records.map(function (payment) {
        return [
          escapeHtml(payment.alumno),
          branchBadge(payment.sede),
          escapeHtml(payment.periodo),
          "$" + escapeHtml(payment.monto),
          paymentStatusBadge(payment.estado_pago),
          escapeHtml(payment.recibo)
        ];
      }), 6, "No hay mensualidades registradas.");
      setMessage("paymentMessage", "Datos cargados desde Supabase.", "success");
    })
    .catch(function (error) {
      setTableMessage("paymentsTable", 6, "No se pudieron cargar las mensualidades.");
      setMessage("paymentMessage", error.message, "error");
    });
}

function loadAttendance() {
  if (!requireSupabase("attendanceTable", 7, "attendanceMessage")) {
    return;
  }

  setTableMessage("attendanceTable", 7, "Cargando asistencia desde Supabase...");

  supabaseRequest("asistencias", "?select=fecha,sede,clase,profesor,alumno,estado,evidencia&order=created_at.desc")
    .then(function (records) {
      renderRows("attendanceTable", records.map(function (attendance) {
        return [
          escapeHtml(attendance.fecha),
          branchBadge(attendance.sede),
          escapeHtml(attendance.clase),
          escapeHtml(attendance.profesor),
          escapeHtml(attendance.alumno),
          escapeHtml(attendance.estado),
          escapeHtml(attendance.evidencia)
        ];
      }), 7, "No hay asistencias registradas.");
      setMessage("attendanceMessage", "Datos cargados desde Supabase.", "success");
    })
    .catch(function (error) {
      setTableMessage("attendanceTable", 7, "No se pudo cargar la asistencia.");
      setMessage("attendanceMessage", error.message, "error");
    });
}

var studentForm = document.getElementById("studentForm");
var paymentForm = document.getElementById("paymentForm");
var attendanceForm = document.getElementById("attendanceForm");

if (studentForm) {
  loadStudents();

  studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!requireSupabase("studentsTable", 6, "studentMessage")) {
      return;
    }

    var payload = {
      nombre: document.getElementById("studentName").value,
      sede: document.getElementById("studentBranch").value,
      clase_nivel: document.getElementById("studentClass").value,
      estado: document.getElementById("studentStatus").value,
      beca_convenio: document.getElementById("studentBenefit").value,
      telefono: document.getElementById("studentPhone").value
    };

    supabaseRequest("alumnos", "", "POST", payload)
      .then(function () {
        setMessage("studentMessage", "Alumno guardado en Supabase.", "success");
        studentForm.reset();
        loadStudents();
      })
      .catch(function (error) {
        setMessage("studentMessage", error.message, "error");
      });
  });
}

if (paymentForm) {
  loadPayments();

  paymentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!requireSupabase("paymentsTable", 6, "paymentMessage")) {
      return;
    }

    var payload = {
      alumno: document.getElementById("paymentStudent").value,
      sede: document.getElementById("paymentBranch").value,
      periodo: document.getElementById("paymentPeriod").value,
      monto: Number(document.getElementById("paymentAmount").value),
      estado_pago: document.getElementById("paymentStatus").value,
      recibo: document.getElementById("paymentReceipt").value
    };

    supabaseRequest("mensualidades", "", "POST", payload)
      .then(function () {
        setMessage("paymentMessage", "Pago guardado en Supabase.", "success");
        paymentForm.reset();
        loadPayments();
      })
      .catch(function (error) {
        setMessage("paymentMessage", error.message, "error");
      });
  });
}

if (attendanceForm) {
  setDefaultDate();
  loadAttendance();

  attendanceForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!requireSupabase("attendanceTable", 7, "attendanceMessage")) {
      return;
    }

    var payload = {
      fecha: document.getElementById("attendanceDate").value,
      sede: document.getElementById("attendanceBranch").value,
      clase: document.getElementById("attendanceClass").value,
      profesor: document.getElementById("attendanceTeacher").value,
      alumno: document.getElementById("attendanceStudent").value,
      estado: document.getElementById("attendanceStatus").value,
      evidencia: makeEvidenceCode()
    };

    supabaseRequest("asistencias", "", "POST", payload)
      .then(function () {
        setMessage("attendanceMessage", "Asistencia guardada en Supabase.", "success");
        attendanceForm.reset();
        setDefaultDate();
        loadAttendance();
      })
      .catch(function (error) {
        setMessage("attendanceMessage", error.message, "error");
      });
  });
}

function setDefaultDate() {
  var dateInput = document.getElementById("attendanceDate");
  var today = new Date().toISOString().slice(0, 10);

  if (dateInput) {
    dateInput.value = today;
  }
}
