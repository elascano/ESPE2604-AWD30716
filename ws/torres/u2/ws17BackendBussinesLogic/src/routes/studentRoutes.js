const express = require("express");

function createStudentRoutes(studentController) {
  const router = express.Router();

  router.get("/students", studentController.listStudents);
  router.post("/students", studentController.createStudent);
  router.get("/students/:id", studentController.getStudent);
  router.put("/students/:id", studentController.updateStudent);
  router.delete("/students/:id", studentController.deleteStudent);
  router.get("/students/:id/report", studentController.getStudentReport);
  router.get("/students/:id/report/excel", studentController.downloadStudentReport);
  router.get("/reports/top-students", studentController.getTopStudentsReport);
  router.get("/reports/top-students/excel", studentController.downloadTopStudentsReport);
  router.get("/reports/summary", studentController.getSummaryReport);
  router.get("/reports/summary/excel", studentController.downloadSummaryReport);
  router.get("/health/database", studentController.getDatabaseHealth);
  router.get("/docs/uris", studentController.getUriDocumentation);

  return router;
}

module.exports = createStudentRoutes;
