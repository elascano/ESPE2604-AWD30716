const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const StudentController = require("./controllers/StudentController");
const StudentRepository = require("./repositories/StudentRepository");
const StudentCalculationService = require("./services/StudentCalculationService");
const ExcelReportService = require("./services/ExcelReportService");
const StudentReportService = require("./services/StudentReportService");
const createStudentRoutes = require("./routes/studentRoutes");

const app = express();
const port = process.env.PORT || 5010;
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/ws14RestWebServices";

const repository = new StudentRepository();
const calculationService = new StudentCalculationService({
  semesterCost: 1200,
  currentDate: new Date(),
});
const reportService = new StudentReportService(repository, calculationService);
const excelReportService = new ExcelReportService();
const studentController = new StudentController(repository, reportService, excelReportService);

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/api", createStudentRoutes(studentController));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

async function startServer() {
  try {
    await mongoose.connect(mongoUrl);

    app.listen(port, () => {
      console.log(`Connected to MongoDB: ${mongoUrl}`);
      console.log(`Student academic system running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el sistema academico:", error.message);
    process.exit(1);
  }
}

startServer();
