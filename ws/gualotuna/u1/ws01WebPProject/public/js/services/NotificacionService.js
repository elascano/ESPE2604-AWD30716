import { generarId } from "../utils/helpers.js";
import { TIPOS_NOTIFICACION, TIEMPOS } from "../utils/constants.js";

export class NotificacionService {
  constructor() {
    this.notificaciones = [];
    this.callbacks = [];
  }

  onNotificacion(callback) {
    this.callbacks.push(callback);
  }

  mostrar(tipo, titulo, mensaje) {
    const notificacion = {
      id: generarId(),
      tipo,
      titulo,
      mensaje,
      timestamp: new Date(),
    };

    this.notificaciones.push(notificacion);

    this.callbacks.forEach((callback) => callback(notificacion));

    setTimeout(() => {
      this.eliminar(notificacion.id);
    }, TIEMPOS.NOTIFICACION_AUTO_CIERRE);

    return notificacion;
  }

  success(titulo, mensaje) {
    return this.mostrar(TIPOS_NOTIFICACION.SUCCESS, titulo, mensaje);
  }

  error(titulo, mensaje) {
    return this.mostrar(TIPOS_NOTIFICACION.ERROR, titulo, mensaje);
  }

  warning(titulo, mensaje) {
    return this.mostrar(TIPOS_NOTIFICACION.WARNING, titulo, mensaje);
  }

  info(titulo, mensaje) {
    return this.mostrar(TIPOS_NOTIFICACION.INFO, titulo, mensaje);
  }

  eliminar(id) {
    const index = this.notificaciones.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.notificaciones.splice(index, 1);
    }
  }

  async enviarEmail(email, asunto, mensaje) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`📧 Email enviado a ${email}`);
        console.log(`   Asunto: ${asunto}`);
        console.log(`   Mensaje: ${mensaje}`);
        resolve(true);
      }, TIEMPOS.SIMULACION_EMAIL);
    });
  }
}
