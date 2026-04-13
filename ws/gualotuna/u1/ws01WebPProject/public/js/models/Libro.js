import { generarId } from '../utils/helpers.js';

export class Libro {
  constructor({ id = null, titulo, autor, genero, descripcion = '', disponible = true }) {
    this.id = id || generarId();
    this.titulo = titulo;
    this.autor = autor;
    this.genero = genero;
    this.descripcion = descripcion;
    this.disponible = disponible;
    this.fechaAgregado = new Date();
  }

  prestar() {
    if (!this.disponible) {
      throw new Error('El libro no está disponible');
    }
    this.disponible = false;
  }

  devolver() {
    this.disponible = true;
  }

  coincideBusqueda(termino) {
    const terminoLower = termino.toLowerCase();
    return (
      this.titulo.toLowerCase().includes(terminoLower) ||
      this.autor.toLowerCase().includes(terminoLower) ||
      this.genero.toLowerCase().includes(terminoLower)
    );
  }

  toJSON() {
    return {
      id: this.id,
      titulo: this.titulo,
      autor: this.autor,
      genero: this.genero,
      descripcion: this.descripcion,
      disponible: this.disponible,
      fechaAgregado: this.fechaAgregado
    };
  }

  static fromJSON(data) {
    const libro = new Libro(data);
    libro.fechaAgregado = new Date(data.fechaAgregado);
    return libro;
  }
}
