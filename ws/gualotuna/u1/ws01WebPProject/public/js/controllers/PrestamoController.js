export class PrestamoController {
  constructor(bibliotecaService, prestamoView) {
    this.bibliotecaService = bibliotecaService;
    this.prestamoView = prestamoView;
  }

  inicializar() {
    this.prestamoView.onPrestarLibro((libroId, usuario, dias) =>
      this.prestarLibro(libroId, usuario, dias)
    );
    this.prestamoView.onDevolverLibro((prestamoId) =>
      this.devolverLibro(prestamoId)
    );

    this.mostrarPrestamos();
  }

  mostrarPrestamos() {
    const prestamos = this.bibliotecaService.prestamos;
    this.prestamoView.renderizar(prestamos);
  }

  async prestarLibro(libroId, usuario, dias) {
    try {
      this.bibliotecaService.notificacionService.info(
        'Procesando',
        'Procesando préstamo...'
      );

      const prestamo = await this.bibliotecaService.procesarPrestamo(libroId, usuario, dias);

      this.bibliotecaService.notificacionService.success(
        'Préstamo Realizado',
        `El libro "${prestamo.libroTitulo}" ha sido prestado a ${usuario}.`
      );

      this.prestamoView.cerrarModal();
      this.prestamoView.limpiarFormulario();
      this.mostrarPrestamos();
    } catch (error) {
      this.bibliotecaService.notificacionService.error(
        'Error',
        error
      );
    }
  }

  async devolverLibro(prestamoId) {
    try {
      this.bibliotecaService.notificacionService.info(
        'Procesando',
        'Procesando devolución...'
      );

      const prestamo = await this.bibliotecaService.procesarDevolucion(prestamoId);

      this.bibliotecaService.notificacionService.success(
        'Devolución Exitosa',
        `El libro "${prestamo.libroTitulo}" ha sido devuelto.`
      );

      this.mostrarPrestamos();
    } catch (error) {
      this.bibliotecaService.notificacionService.error(
        'Error',
        error
      );
    }
  }
}
