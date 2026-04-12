import { generarId, calcularDiferenciaDias } from '../utils/helpers.js';
import { ESTADOS_PRESTAMO, DIAS } from '../utils/constants.js';

export class Prestamo {
  constructor({ id = null, libroId, libroTitulo, usuario, dias = DIAS.PRESTAMO_DEFAULT }) {
    this.id = id || generarId();
    this.libroId = libroId;
    this.libroTitulo = libroTitulo;
    this.usuario = usuario;
    this.fechaPrestamo = new Date();
    this.fechaDevolucion = this.calcularFechaDevolucion(dias);
    this.estado = this.calcularEstado();
  }

  calcularFechaDevolucion(dias) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }

  calcularEstado() {
    const hoy = new Date();
    const diferenciaDias = calcularDiferenciaDias(this.fechaDevolucion, hoy);

    if (diferenciaDias < 0) return ESTADOS_PRESTAMO.VENCIDO;
    if (diferenciaDias <= DIAS.PRESTAMO_PROXIMO_VENCER) return ESTADOS_PRESTAMO.PROXIMO;
    return ESTADOS_PRESTAMO.ACTIVO;
  }

  actualizarEstado() {
    const estadoAnterior = this.estado;
    this.estado = this.calcularEstado();
    return estadoAnterior !== this.estado;
  }

  getDiasRestantes() {
    const dias = calcularDiferenciaDias(this.fechaDevolucion, new Date());
    return Math.max(0, dias);
  }

  estaVencido() {
    return this.estado === ESTADOS_PRESTAMO.VENCIDO;
  }

  estaProximoVencer() {
    return this.estado === ESTADOS_PRESTAMO.PROXIMO;
  }

  toJSON() {
    return {
      id: this.id,
      libroId: this.libroId,
      libroTitulo: this.libroTitulo,
      usuario: this.usuario,
      fechaPrestamo: this.fechaPrestamo,
      fechaDevolucion: this.fechaDevolucion,
      estado: this.estado
    };
  }

  static fromJSON(data) {
    const prestamo = Object.create(Prestamo.prototype);
    Object.assign(prestamo, data);
    prestamo.fechaPrestamo = new Date(data.fechaPrestamo);
    prestamo.fechaDevolucion = new Date(data.fechaDevolucion);
    return prestamo;
  }
}
