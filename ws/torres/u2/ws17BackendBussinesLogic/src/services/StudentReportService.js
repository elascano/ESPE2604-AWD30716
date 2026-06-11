class StudentReportService {
  constructor(studentRepository, calculationService) {
    this.studentRepository = studentRepository;
    this.calculationService = calculationService;
  }

  async getAllStudentsReport() {
    const students = await this.studentRepository.findAll();
    return students.map((student) => this.calculationService.enrichStudent(student));
  }

  async getStudentReport(id) {
    const student = await this.studentRepository.findById(id);

    if (!student) {
      return null;
    }

    return this.calculationService.enrichStudent(student);
  }

  async getTopStudentsReport(limit = 5) {
    const students = await this.getAllStudentsReport();

    return students
      .sort((first, second) => second.promedio - first.promedio || first.valorPagarSemestre - second.valorPagarSemestre)
      .slice(0, limit)
      .map((student, index) => ({
        puesto: index + 1,
        ...student,
      }));
  }

  async getSummaryReport() {
    const students = await this.getAllStudentsReport();
    const totalPayment = students.reduce((sum, student) => sum + student.valorPagarSemestre, 0);
    const averageGrade = students.reduce((sum, student) => sum + student.promedio, 0) / students.length;
    const topStudents = await this.getTopStudentsReport(1);

    return {
      totalEstudiantes: students.length,
      promedioGeneral: Number(averageGrade.toFixed(2)),
      recaudacionEsperada: Number(totalPayment.toFixed(2)),
      mejorPromedio: topStudents[0],
    };
  }
}

module.exports = StudentReportService;
