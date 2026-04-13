export class ReservaController {
  constructor(bibliotecaService, reservaView) {
    this.bibliotecaService = bibliotecaService;
    this.reservaView = reservaView;
  }

  inicializar() {
    this.reservaView.onReservarLibro((libroId, usuario, email) =>
      this.reservarLibro(libroId, usuario, email)
    );
    this.reservaView.onCancelarReserva((reservaId) =>
      this.cancelarReserva(reservaId)
    );

    this.mostrarReservas();
  }

  mostrarReservas() {
    const reservas = this.bibliotecaService.reservas;
    this.reservaView.renderizar(reservas);
  }

  async reservarLibro(libroId, usuario, email) {
    try {
      this.bibliotecaService.notificacionService.info(
        'Procesando',
        'Procesando reserva...'
      );

      const reserva = await this.bibliotecaService.procesarReserva(libroId, usuario, email);

      this.bibliotecaService.notificacionService.success(
        'Reserva Realizada',
        `Tu reserva para "${reserva.libroTitulo}" ha sido confirmada. Te notificaremos cuando esté disponible.`
      );

      this.reservaView.cerrarModal();
      this.reservaView.limpiarFormulario();
      this.mostrarReservas();
    } catch (error) {
      this.bibliotecaService.notificacionService.error(
        'Error',
        error
      );
    }
  }

  cancelarReserva(reservaId) {
    const reserva = this.bibliotecaService.reservas.find(r => r.id === reservaId);

    if (!reserva) return;

    if (confirm(`¿Cancelar la reserva de "${reserva.libroTitulo}"?`)) {
      this.bibliotecaService.cancelarReserva(reservaId);

      this.bibliotecaService.notificacionService.info(
        'Reserva Cancelada',
        `La reserva de "${reserva.libroTitulo}" ha sido cancelada.`
      );

      this.mostrarReservas();
    }
  }
}
