import { Libro } from "../models/Libro.js";
import { Prestamo } from "../models/Prestamo.js";
import { Reserva } from "../models/Reserva.js";
import { NotificacionService } from "./NotificacionService.js";
import { TIEMPOS, DIAS } from "../utils/constants.js";

export class BibliotecaService {
  constructor() {
    this.libros = [];
    this.prestamos = [];
    this.reservas = [];
    this.notificacionService = new NotificacionService();
    this.intervalosNotificacion = [];
  }

  agregarLibro(datosLibro) {
    const libro = new Libro(datosLibro);
    this.libros.push(libro);
    return libro;
  }

  eliminarLibro(id) {
    const index = this.libros.findIndex((libro) => libro.id === id);
    if (index !== -1) {
      this.libros.splice(index, 1);
      return true;
    }
    return false;
  }

  buscarLibroPorId(id) {
    return this.libros.find((libro) => libro.id === id) || null;
  }

  buscarLibros(termino = "", genero = "", disponibilidad = "") {
    return this.libros.filter((libro) => {
      const cumpleBusqueda = termino === "" || libro.coincideBusqueda(termino);
      const cumpleGenero = genero === "" || libro.genero === genero;
      const cumpleDisponibilidad =
        disponibilidad === "" ||
        (disponibilidad === "disponible" && libro.disponible) ||
        (disponibilidad === "prestado" && !libro.disponible);

      return cumpleBusqueda && cumpleGenero && cumpleDisponibilidad;
    });
  }

  obtenerLibrosDisponibles() {
    return this.libros.filter((libro) => libro.disponible);
  }

  obtenerLibrosPrestados() {
    return this.libros.filter((libro) => !libro.disponible);
  }

  async procesarPrestamo(libroId, usuario, dias) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const libro = this.buscarLibroPorId(libroId);

        if (!libro) {
          reject("Libro no encontrado");
          return;
        }

        if (!libro.disponible) {
          reject("El libro no está disponible");
          return;
        }

        try {
          libro.prestar();

          const prestamo = new Prestamo({
            libroId: libro.id,
            libroTitulo: libro.titulo,
            usuario,
            dias,
          });

          this.prestamos.push(prestamo);
          this.programarRecordatorio(prestamo.id);

          resolve(prestamo);
        } catch (error) {
          reject(error.message);
        }
      }, TIEMPOS.SIMULACION_PRESTAMO);
    });
  }

  async procesarDevolucion(prestamoId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.prestamos.findIndex((p) => p.id === prestamoId);

        if (index === -1) {
          reject("Préstamo no encontrado");
          return;
        }

        const prestamo = this.prestamos[index];
        const libro = this.buscarLibroPorId(prestamo.libroId);

        if (libro) {
          libro.devolver();
        }

        this.prestamos.splice(index, 1);

        this.verificarReservas(prestamo.libroId);

        resolve(prestamo);
      }, TIEMPOS.SIMULACION_DEVOLUCION);
    });
  }

  programarRecordatorio(prestamoId, diasAntes = DIAS.RECORDATORIO_ANTES) {
    const prestamo = this.prestamos.find((p) => p.id === prestamoId);
    if (!prestamo) return;

    const fechaRecordatorio = new Date(prestamo.fechaDevolucion);
    fechaRecordatorio.setDate(fechaRecordatorio.getDate() - diasAntes);

    const tiempoHastaRecordatorio = fechaRecordatorio - new Date();

    if (tiempoHastaRecordatorio > 0) {
      const timeoutId = setTimeout(() => {
        this.notificacionService.warning(
          "Recordatorio de Devolución",
          `El libro "${prestamo.libroTitulo}" debe ser devuelto en ${diasAntes} días.`,
        );
      }, tiempoHastaRecordatorio);

      this.intervalosNotificacion.push(timeoutId);
    }
  }

  iniciarVerificacionPrestamos() {
    const intervalId = setInterval(() => {
      this.prestamos.forEach((prestamo) => {
        const cambioEstado = prestamo.actualizarEstado();

        if (cambioEstado && prestamo.estaVencido()) {
          this.notificacionService.error(
            "Préstamo Vencido",
            `El préstamo del libro "${prestamo.libroTitulo}" ha vencido.`,
          );
        }
      });
    }, TIEMPOS.VERIFICACION_PRESTAMOS);

    this.intervalosNotificacion.push(intervalId);
  }

  async procesarReserva(libroId, usuario, email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const libro = this.buscarLibroPorId(libroId);

        if (!libro) {
          reject("Libro no encontrado");
          return;
        }

        if (libro.disponible) {
          reject(
            "El libro está disponible, puede realizar un préstamo directo",
          );
          return;
        }

        const reserva = new Reserva({
          libroId: libro.id,
          libroTitulo: libro.titulo,
          usuario,
          email,
        });

        this.reservas.push(reserva);
        resolve(reserva);
      }, TIEMPOS.SIMULACION_RESERVA);
    });
  }

  cancelarReserva(reservaId) {
    const index = this.reservas.findIndex((r) => r.id === reservaId);
    if (index !== -1) {
      this.reservas.splice(index, 1);
      return true;
    }
    return false;
  }

  verificarReservas(libroId) {
    const reservasPendientes = this.reservas.filter(
      (r) => r.libroId === libroId && r.estaPendiente(),
    );

    if (reservasPendientes.length > 0) {
      const primeraReserva = reservasPendientes[0];

      this.notificacionService.success(
        "Libro Disponible",
        `El libro "${primeraReserva.libroTitulo}" está disponible para ${primeraReserva.usuario}.`,
      );

      this.notificacionService.enviarEmail(
        primeraReserva.email,
        "Libro Disponible",
        `El libro "${primeraReserva.libroTitulo}" que reservaste está ahora disponible.`,
      );
    }
  }

  obtenerEstadisticas() {
    const totalLibros = this.libros.length;
    const disponibles = this.obtenerLibrosDisponibles().length;
    const prestamosActivos = this.prestamos.length;
    const reservasPendientes = this.reservas.filter((r) =>
      r.estaPendiente(),
    ).length;

    const librosPorGenero = this.libros.reduce((acc, libro) => {
      acc[libro.genero] = (acc[libro.genero] || 0) + 1;
      return acc;
    }, {});

    return {
      totalLibros,
      disponibles,
      prestamosActivos,
      reservasPendientes,
      librosPorGenero,
    };
  }

  limpiarIntervalos() {
    this.intervalosNotificacion.forEach((id) => clearInterval(id));
    this.intervalosNotificacion = [];
  }
}
