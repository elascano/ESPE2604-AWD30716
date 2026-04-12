import { formatearFecha, sanitizarString } from '../utils/helpers.js';

export class ReservaView {
  constructor() {
    this.lista = document.getElementById('reservas-list');
    this.modal = document.getElementById('modal-reservar-libro');
    this.form = document.getElementById('form-reservar-libro');

    this.callbacks = {
      onReservarLibro: null,
      onCancelarReserva: null
    };

    this.inicializarEventos();
  }

  inicializarEventos() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleReservarLibro();
    });
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.cerrarModal();
      }
    });

    const closeButtons = this.modal.querySelectorAll('.modal-close, [data-modal]');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => this.cerrarModal());
    });
  }

  onReservarLibro(callback) {
    this.callbacks.onReservarLibro = callback;
  }

  onCancelarReserva(callback) {
    this.callbacks.onCancelarReserva = callback;
  }

  handleReservarLibro() {
    const libroId = document.getElementById('reserva-libro-id').value;
    const usuario = document.getElementById('reserva-usuario').value;
    const email = document.getElementById('reserva-email').value;

    if (this.callbacks.onReservarLibro) {
      this.callbacks.onReservarLibro(libroId, usuario, email);
    }
  }

  handleAccion(e) {
    const button = e.target.closest('[data-action="cancelar"]');
    if (!button) return;

    const id = button.dataset.id;
    if (this.callbacks.onCancelarReserva) {
      this.callbacks.onCancelarReserva(id);
    }
  }

  renderizar(reservas) {
    if (reservas.length === 0) {
      this.lista.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⏰</div>
          <h3 class="empty-state-title">No hay reservas pendientes</h3>
          <p class="empty-state-message">Las reservas aparecerán aquí.</p>
        </div>
      `;
      return;
    }

    this.lista.innerHTML = reservas.map(reserva => this.renderizarReservaCard(reserva)).join('');
  }

  renderizarReservaCard(reserva) {
    const titulo = sanitizarString(reserva.libroTitulo);
    const usuario = sanitizarString(reserva.usuario);
    const email = sanitizarString(reserva.email);

    return `
      <div class="reserva-card">
        <div class="reserva-header">
          <h4 class="reserva-titulo">${titulo}</h4>
          <p class="reserva-usuario">Reservado por: ${usuario}</p>
        </div>
        <div class="reserva-status">
          <span>⏰</span>
          <span>En espera</span>
        </div>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
          📧 Email: ${email}<br>
          📅 Fecha: ${formatearFecha(reserva.fechaReserva)}
        </p>
        <div class="reserva-actions">
          <button class="btn btn-danger btn-sm" data-action="cancelar" data-id="${reserva.id}">
            <span class="icon">❌</span>
            Cancelar Reserva
          </button>
        </div>
      </div>
    `;
  }

  abrirModal(libroId) {
    document.getElementById('reserva-libro-id').value = libroId;
    this.modal.classList.add('active');
  }

  cerrarModal() {
    this.modal.classList.remove('active');
  }

  limpiarFormulario() {
    this.form.reset();
  }
}
