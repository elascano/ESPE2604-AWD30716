import { generarId } from '../utils/helpers.js';
import { ESTADOS_RESERVA } from '../utils/constants.js';

export class Reserva {
  constructor({ id = null, libroId, libroTitulo, usuario, email }) {
    this.id = id || generarId();
    this.libroId = libroId;
    this.libroTitulo = libroTitulo;
    this.usuario = usuario;
    this.email = email;
    this.fechaReserva = new Date();
    this.estado = ESTADOS_RESERVA.PENDIENTE;
  }

  completar() {
    this.estado = ESTADOS_RESERVA.COMPLETADA;
  }

  cancelar() {
    this.estado = ESTADOS_RESERVA.CANCELADA;
  }

  estaPendiente() {
    return this.estado === ESTADOS_RESERVA.PENDIENTE;
  }

  toJSON() {
    return {
      id: this.id,
      libroId: this.libroId,
      libroTitulo: this.libroTitulo,
      usuario: this.usuario,
      email: this.email,
      fechaReserva: this.fechaReserva,
      estado: this.estado
    };
  }

  static fromJSON(data) {
    const reserva = Object.create(Reserva.prototype);
    Object.assign(reserva, data);
    reserva.fechaReserva = new Date(data.fechaReserva);
    return reserva;
  }
}
