import { BibliotecaService } from '../services/BibliotecaService.js';
import { LibroController } from './LibroController.js';
import { PrestamoController } from './PrestamoController.js';
import { ReservaController } from './ReservaController.js';
import { LibroView } from '../views/LibroView.js';
import { PrestamoView } from '../views/PrestamoView.js';
import { ReservaView } from '../views/ReservaView.js';
import { EstadisticaView } from '../views/EstadisticaView.js';
import { librosIniciales, prestamosIniciales } from '../utils/datosIniciales.js';

export class AppController {
  constructor() {
    this.bibliotecaService = new BibliotecaService();

    this.libroView = new LibroView();
    this.prestamoView = new PrestamoView();
    this.reservaView = new ReservaView();
    this.estadisticaView = new EstadisticaView();

    this.libroController = new LibroController(this.bibliotecaService, this.libroView);
    this.prestamoController = new PrestamoController(this.bibliotecaService, this.prestamoView);
    this.reservaController = new ReservaController(this.bibliotecaService, this.reservaView);

    this.seccionActual = 'libros';
  }

  async inicializar() {
    console.log('🚀 Iniciando Sistema de Biblioteca Digital...');

    await this.cargarDatosIniciales();

    this.libroController.inicializar();
    this.prestamoController.inicializar();
    this.reservaController.inicializar();

    this.configurarNavegacion();

    this.configurarNotificaciones();

    this.configurarDelegacionEventos();

    setTimeout(() => {
      this.bibliotecaService.iniciarVerificacionPrestamos();
    }, 1000);

    this.actualizarEstadisticas();

    setTimeout(() => {
      this.bibliotecaService.notificacionService.success(
        '¡Bienvenido!',
        'Sistema de Biblioteca Digital iniciado correctamente.'
      );
    }, 500);

    console.log('✅ Sistema iniciado correctamente');
  }

  async cargarDatosIniciales() {
    librosIniciales.forEach(libroData => {
      this.bibliotecaService.agregarLibro(libroData);
    });

    const promesasPrestamos = prestamosIniciales.map(async (prestamoData) => {
      const libro = this.bibliotecaService.libros.find(
        l => l.titulo === prestamoData.libroTitulo
      );

      if (libro) {
        try {
          await this.bibliotecaService.procesarPrestamo(
            libro.id,
            prestamoData.usuario,
            prestamoData.dias
          );
        } catch (error) {
          console.error('Error al crear préstamo inicial:', error);
        }
      }
    });

    await Promise.all(promesasPrestamos);
  }

  configurarNavegacion() {
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const seccion = btn.getAttribute('data-section');
        this.cambiarSeccion(seccion);
      });
    });
  }

  cambiarSeccion(seccion) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-section') === seccion) {
        btn.classList.add('active');
      }
    });

    document.querySelectorAll('.section').forEach(sec => {
      sec.classList.remove('active');
    });
    document.getElementById(`section-${seccion}`).classList.add('active');

    this.seccionActual = seccion;

    switch(seccion) {
      case 'libros':
        this.libroController.mostrarLibros();
        break;
      case 'prestamos':
        this.prestamoController.mostrarPrestamos();
        break;
      case 'reservas':
        this.reservaController.mostrarReservas();
        break;
      case 'estadisticas':
        this.actualizarEstadisticas();
        break;
    }
  }

  configurarNotificaciones() {
    const container = document.getElementById('notification-container');

    this.bibliotecaService.notificacionService.onNotificacion((notificacion) => {
      this.renderizarNotificacion(notificacion, container);
    });
  }

  renderizarNotificacion(notificacion, container) {
    const notifElement = document.createElement('div');
    notifElement.className = `notification ${notificacion.tipo}`;
    notifElement.id = `notif-${notificacion.id}`;
    notifElement.innerHTML = `
      <div class="notification-header">
        <span class="notification-title">${notificacion.titulo}</span>
        <button class="notification-close" data-notif-id="${notificacion.id}">&times;</button>
      </div>
      <p class="notification-message">${notificacion.mensaje}</p>
    `;

    const closeBtn = notifElement.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      this.cerrarNotificacion(notificacion.id);
    });

    container.appendChild(notifElement);

    setTimeout(() => {
      this.cerrarNotificacion(notificacion.id);
    }, 5000);
  }

  cerrarNotificacion(id) {
    const notifElement = document.getElementById(`notif-${id}`);
    if (notifElement) {
      notifElement.style.animation = 'slideInRight 0.3s ease reverse';
      setTimeout(() => {
        notifElement.remove();
        this.bibliotecaService.notificacionService.eliminar(id);
      }, 300);
    }
  }

  configurarDelegacionEventos() {
    const grid = document.getElementById('libros-grid');

    grid.addEventListener('click', (e) => {
      const button = e.target.closest('[data-action]');
      if (!button) return;

      const action = button.dataset.action;
      const id = button.dataset.id;

      switch (action) {
        case 'eliminar':
          this.libroController.eliminarLibro(id);
          this.actualizarEstadisticas();
          break;
        case 'prestar':
          this.prestamoView.abrirModal(id);
          break;
        case 'reservar':
          this.reservaView.abrirModal(id);
          break;
      }
    });

    const prestamosList = document.getElementById('prestamos-list');
    prestamosList.addEventListener('click', (e) => {
      this.prestamoView.handleAccion(e);
      this.actualizarEstadisticas();
      this.libroController.mostrarLibros();
    });

    const reservasList = document.getElementById('reservas-list');
    reservasList.addEventListener('click', (e) => {
      this.reservaView.handleAccion(e);
      this.actualizarEstadisticas();
    });
  }

  actualizarEstadisticas() {
    const stats = this.bibliotecaService.obtenerEstadisticas();
    this.estadisticaView.renderizar(stats);
  }
}
