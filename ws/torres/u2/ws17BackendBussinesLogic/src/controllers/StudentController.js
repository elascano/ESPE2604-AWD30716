class StudentController {
  constructor(studentRepository, reportService, excelReportService) {
    this.studentRepository = studentRepository;
    this.reportService = reportService;
    this.excelReportService = excelReportService;
  }

  listStudents = async (req, res) => {
    try {
      res.json(await this.reportService.getAllStudentsReport());
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  getStudent = async (req, res) => {
    try {
      const student = await this.studentRepository.findById(req.params.id);

      if (!student) {
        return res.status(404).json({ message: "Estudiante no encontrado" });
      }

      return res.json(student);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  getStudentReport = async (req, res) => {
    try {
      const report = await this.reportService.getStudentReport(req.params.id);

      if (!report) {
        return res.status(404).json({ message: "Reporte de estudiante no encontrado" });
      }

      return res.json(report);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  createStudent = async (req, res) => {
    try {
      const student = await this.studentRepository.create(req.body);
      return res.status(201).json(student);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  updateStudent = async (req, res) => {
    try {
      const student = await this.studentRepository.update(req.params.id, req.body);

      if (!student) {
        return res.status(404).json({ message: "Estudiante no encontrado" });
      }

      return res.json(student);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  deleteStudent = async (req, res) => {
    try {
      const student = await this.studentRepository.delete(req.params.id);

      if (!student) {
        return res.status(404).json({ message: "Estudiante no encontrado" });
      }

      return res.json({ message: "Estudiante eliminado", student });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  getDatabaseHealth = async (req, res) => {
    try {
      res.json(await this.studentRepository.getDatabaseStatus());
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  getTopStudentsReport = async (req, res) => {
    try {
      const limit = Number(req.query.limit) || 5;
      res.json(await this.reportService.getTopStudentsReport(limit));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  getSummaryReport = async (req, res) => {
    try {
      res.json(await this.reportService.getSummaryReport());
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  downloadStudentReport = async (req, res) => {
    try {
      const report = await this.reportService.getStudentReport(req.params.id);

      if (!report) {
        return res.status(404).json({ message: "Reporte de estudiante no encontrado" });
      }

      return this.sendExcel(res, `reporte-estudiante-${req.params.id}.xls`, this.excelReportService.createStudentsWorkbook("Reporte individual", [report]));
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  downloadTopStudentsReport = async (req, res) => {
    try {
      const limit = Number(req.query.limit) || 5;
      const report = await this.reportService.getTopStudentsReport(limit);

      return this.sendExcel(res, "reporte-mejores-estudiantes.xls", this.excelReportService.createStudentsWorkbook("Mejores estudiantes", report));
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  downloadSummaryReport = async (req, res) => {
    try {
      const summary = await this.reportService.getSummaryReport();

      return this.sendExcel(res, "reporte-general-estudiantes.xls", this.excelReportService.createSummaryWorkbook(summary));
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  getUriDocumentation = (req, res) => {
    res.json({
      baseUrl: "/api",
      recursos: [
        { metodo: "GET", uri: "/api/students", descripcion: "Lista estudiantes con calculos de negocio" },
        { metodo: "POST", uri: "/api/students", descripcion: "Crea un estudiante" },
        { metodo: "GET", uri: "/api/students/:id", descripcion: "Consulta los 7 atributos base de un estudiante" },
        { metodo: "PUT", uri: "/api/students/:id", descripcion: "Actualiza un estudiante completo o parcial" },
        { metodo: "DELETE", uri: "/api/students/:id", descripcion: "Elimina un estudiante" },
        { metodo: "GET", uri: "/api/students/:id/report", descripcion: "Reporte individual con edad, pago y beca" },
        { metodo: "GET", uri: "/api/students/:id/report/excel", descripcion: "Descarga el reporte individual en formato Excel" },
        { metodo: "GET", uri: "/api/reports/top-students?limit=5", descripcion: "Reporte de mejores estudiantes por promedio" },
        { metodo: "GET", uri: "/api/reports/top-students/excel?limit=5", descripcion: "Descarga mejores estudiantes en formato Excel" },
        { metodo: "GET", uri: "/api/reports/summary", descripcion: "Reporte general de estudiantes" },
        { metodo: "GET", uri: "/api/reports/summary/excel", descripcion: "Descarga reporte general en formato Excel" },
        { metodo: "GET", uri: "/api/health/database", descripcion: "Verifica la base de datos MongoDB usada por el backend" },
        { metodo: "GET", uri: "/api/docs/uris", descripcion: "Documentacion de URIs REST del sistema" }
      ],
    });
  };

  sendExcel(res, filename, content) {
    res.setHeader("Content-Type", "application/vnd.ms-excel; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.send(content);
  }
}

module.exports = StudentController;
