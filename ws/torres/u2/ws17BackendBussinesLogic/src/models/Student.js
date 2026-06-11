class Student {
  constructor({ id, name, descripcion, fechaNacimiento, quintilSocioeconomico, promedio, porcentajeBeca }) {
    this.id = Number(id);
    this.name = name;
    this.descripcion = descripcion;
    this.fechaNacimiento = fechaNacimiento;
    this.quintilSocioeconomico = Number(quintilSocioeconomico);
    this.promedio = Number(promedio);
    this.porcentajeBeca = Number(porcentajeBeca);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      descripcion: this.descripcion,
      fechaNacimiento: this.fechaNacimiento,
      quintilSocioeconomico: this.quintilSocioeconomico,
      promedio: this.promedio,
      porcentajeBeca: this.porcentajeBeca,
    };
  }
}

module.exports = Student;
