var branchData = {
  todas: {
    title: "Todas las sedes",
    students: 248,
    cash: "$1,460",
    late: 32,
    attendance: "84%"
  },
  Matriz: {
    title: "Sede Matriz",
    students: 72,
    cash: "$520",
    late: 8,
    attendance: "89%"
  },
  Norte: {
    title: "Sede Norte",
    students: 54,
    cash: "$410",
    late: 7,
    attendance: "81%"
  },
  Quitumbe: {
    title: "Sede Quitumbe",
    students: 46,
    cash: "$300",
    late: 6,
    attendance: "86%"
  },
  Conocoto: {
    title: "Sede Conocoto",
    students: 38,
    cash: "$120",
    late: 5,
    attendance: "78%"
  },
  Tumbaco: {
    title: "Sede Tumbaco",
    students: 38,
    cash: "$110",
    late: 6,
    attendance: "83%"
  }
};

var branchSelect = document.getElementById("branchSelect");
var searchInput = document.getElementById("studentSearch");
var rows = document.querySelectorAll("#studentsTable tr");
var paymentForm = document.getElementById("paymentForm");
var attendanceButton = document.getElementById("attendanceButton");

function updateDashboard(branch) {
  var data = branchData[branch];

  document.getElementById("branchTitle").textContent = data.title;
  document.getElementById("activeStudents").textContent = data.students;
  document.getElementById("cashToday").textContent = data.cash;
  document.getElementById("latePayments").textContent = data.late;
  document.getElementById("attendanceRate").textContent = data.attendance;
}

function filterStudents() {
  var branch = branchSelect.value;
  var searchText = searchInput.value.toLowerCase();

  rows.forEach(function (row) {
    var rowBranch = row.getAttribute("data-branch");
    var rowText = row.textContent.toLowerCase();
    var branchMatches = branch === "todas" || rowBranch === branch;
    var textMatches = rowText.indexOf(searchText) !== -1;

    row.classList.toggle("hidden", !branchMatches || !textMatches);
  });
}

branchSelect.addEventListener("change", function () {
  updateDashboard(branchSelect.value);
  filterStudents();
});

searchInput.addEventListener("input", filterStudents);

paymentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var student = document.getElementById("studentName").value.trim();
  var branch = document.getElementById("paymentBranch").value;
  var amount = document.getElementById("paymentAmount").value;
  var message = document.getElementById("formMessage");

  message.textContent = "Pago registrado: " + student + " | " + branch + " | $" + amount;
  paymentForm.reset();
});

attendanceButton.addEventListener("click", function () {
  var message = document.getElementById("attendanceMessage");
  var code = Math.floor(1000 + Math.random() * 9000);

  message.textContent = "QR simulado generado. Codigo: ALC-" + code;
});
