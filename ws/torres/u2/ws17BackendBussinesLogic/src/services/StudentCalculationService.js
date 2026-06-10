class StudentCalculationService {
  constructor({ semesterCost, currentDate }) {
    this.semesterCost = semesterCost;
    this.currentDate = currentDate;
  }

  calculateAge(fechaNacimiento) {
    const birthDate = new Date(`${fechaNacimiento}T00:00:00`);
    let age = this.currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = this.currentDate.getMonth() - birthDate.getMonth();
    const hasBirthdayPassed =
      monthDifference > 0 ||
      (monthDifference === 0 && this.currentDate.getDate() >= birthDate.getDate());

    return hasBirthdayPassed ? age : age - 1;
  }

  calculatePaymentPercentage(quintilSocioeconomico) {
    const percentagesByQuintile = {
      1: 35,
      2: 50,
      3: 70,
      4: 85,
      5: 100,
    };

    return percentagesByQuintile[quintilSocioeconomico] || 100;
  }

  calculateScholarshipDiscount(porcentajeBeca) {
    return Math.min(Math.max(Number(porcentajeBeca), 0), 100);
  }

  calculateSemesterPayment(student) {
    const paymentPercentage = this.calculatePaymentPercentage(student.quintilSocioeconomico);
    const basePayment = this.semesterCost * (paymentPercentage / 100);
    const discount = basePayment * (this.calculateScholarshipDiscount(student.porcentajeBeca) / 100);

    return Number((basePayment - discount).toFixed(2));
  }

  enrichStudent(student) {
    return {
      ...student.toJSON(),
      edad: this.calculateAge(student.fechaNacimiento),
      costoSemestre: this.semesterCost,
      porcentajePagoPorQuintil: this.calculatePaymentPercentage(student.quintilSocioeconomico),
      descuentoPorBeca: this.calculateScholarshipDiscount(student.porcentajeBeca),
      valorPagarSemestre: this.calculateSemesterPayment(student),
    };
  }
}

module.exports = StudentCalculationService;
