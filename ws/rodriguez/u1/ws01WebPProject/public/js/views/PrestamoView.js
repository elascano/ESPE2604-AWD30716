import { formatearFecha, sanitizarString } from '../utils/helpers.js';

export class PrestamoView {
  constructor() {
    this.lista = document.getElementById('prestamos-list');
    this.contadorActivos = document.getElementById('prestamos-activos');
    this.contadorVencidos = document.getElementById('prestamos-vencidos');
    this.modal = document.getElementById('modal-prestar-libro');
    this.form = document.getElementById('form-prestar-libro');

    this.callbacks = {
      onPrestarLibro: null,
      onDevolverLibro: null
    };

    this.inicializarEventos();
  }

  inicializarEventos() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handlePrestarLibro();
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

  onPrestarLibro(callback) {
    this.callbacks.onPrestarLibro = callback;
  }

  onDevolverLibro(callback) {
    this.callbacks.onDevolverLibro = callback;
  }

  handlePrestarLibro() {
    const libroId = document.getElementById('prestamo-libro-id').value;
    const usuario = document.getElementById('prestamo-usuario').value;
    const dias = parseInt(document.getElementById('prestamo-dias').value);

    if (this.callbacks.onPrestarLibro) {
      this.callbacks.onPrestarLibro(libroId, usuario, dias);
    }
  }

  handleAccion(e) {
    const button = e.target.closest('[data-action="devolver"]');
    if (!button) return;

    const id = button.dataset.id;
    if (this.callbacks.onDevolverLibro) {
      this.callbacks.onDevolverLibro(id);
    }
  }

  renderizar(prestamos) {
    const activos = prestamos.filter(p => !p.estaVencido()).length;
    const vencidos = prestamos.filter(p => p.estaVencido()).length;

    this.contadorActivos.textContent = activos;
    this.contadorVencidos.textContent = vencidos;

    if (prestamos.length === 0) {
      this.lista.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📖</div>
          <h3 class="empty-state-title">No hay préstamos activos</h3>
          <p class="empty-state-message">Los préstamos aparecerán aquí.</p>
        </div>
      `;
      return;
    }

    this.lista.innerHTML = prestamos.map(prestamo => this.renderizarPrestamoCard(prestamo)).join('');
  }



  renderizarPrestamoCard(prestamo) {
    const titulo = sanitizarString(prestamo.libroTitulo);
    const usuario = sanitizarString(prestamo.usuario);
    const diasRestantes = prestamo.getDiasRestantes();

    const textoEstado = prestamo.estaVencido() ? 'Vencido' :
      prestamo.estaProximoVencer() ? 'Próximo a vencer' : 'Activo';

    return `
      <div class="prestamo-card">
        <div class="prestamo-header">
          <div class="prestamo-info">
            <h4>${titulo}</h4>
            <p class="prestamo-usuario">Prestado a: ${usuario}</p>
          </div>
          <span class="prestamo-badge ${prestamo.estado}">${textoEstado}</span>
        </div>
        <div class="prestamo-details">
          <span>📅 Fecha préstamo: ${formatearFecha(prestamo.fechaPrestamo)}</span>
          <span>📆 Fecha devolución: ${formatearFecha(prestamo.fechaDevolucion)}</span>
          <span>⏰ Días restantes: ${diasRestantes}</span>
        </div>
        <div class="prestamo-actions">
          <button class="btn btn-success btn-sm" data-action="devolver" data-id="${prestamo.id}">
            <span class="icon">✅</span>
            Devolver
          </button>
        </div>
      </div>
    `;
  }

  abrirModal(libroId) {
    document.getElementById('prestamo-libro-id').value = libroId;
    this.modal.classList.add('active');
  }

  cerrarModal() {
    this.modal.classList.remove('active');
  }

  limpiarFormulario() {
    this.form.reset();
  }
}
