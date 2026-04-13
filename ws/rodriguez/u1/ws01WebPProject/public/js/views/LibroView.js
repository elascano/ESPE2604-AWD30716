import { sanitizarString } from '../utils/helpers.js';

export class LibroView {
  constructor() {
    this.grid = document.getElementById('libros-grid');
    this.searchInput = document.getElementById('search-input');
    this.filterGenero = document.getElementById('filter-genero');
    this.filterDisponibilidad = document.getElementById('filter-disponibilidad');
    this.btnAgregar = document.getElementById('btn-agregar-libro');
    this.modal = document.getElementById('modal-agregar-libro');
    this.form = document.getElementById('form-agregar-libro');

    this.callbacks = {
      onAgregarLibro: null,
      onEliminarLibro: null,
      onBuscar: null,
      onPrestarLibro: null,
      onReservarLibro: null
    };

    this.inicializarEventos();
  }

  inicializarEventos() {
    this.btnAgregar.addEventListener('click', () => this.abrirModal());
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAgregarLibro();
    });
    this.searchInput.addEventListener('input', () => this.handleBuscar());
    this.filterGenero.addEventListener('change', () => this.handleBuscar());
    this.filterDisponibilidad.addEventListener('change', () => this.handleBuscar());
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

  onAgregarLibro(callback) {
    this.callbacks.onAgregarLibro = callback;
  }

  onEliminarLibro(callback) {
    this.callbacks.onEliminarLibro = callback;
  }

  onBuscar(callback) {
    this.callbacks.onBuscar = callback;
  }

  onPrestarLibro(callback) {
    this.callbacks.onPrestarLibro = callback;
  }

  onReservarLibro(callback) {
    this.callbacks.onReservarLibro = callback;
  }

  handleAgregarLibro() {
    const datosLibro = {
      titulo: document.getElementById('libro-titulo').value,
      autor: document.getElementById('libro-autor').value,
      genero: document.getElementById('libro-genero').value,
      descripcion: document.getElementById('libro-descripcion').value
    };

    if (this.callbacks.onAgregarLibro) {
      this.callbacks.onAgregarLibro(datosLibro);
    }
  }

  handleBuscar() {
    const termino = this.searchInput.value;
    const genero = this.filterGenero.value;
    const disponibilidad = this.filterDisponibilidad.value;

    if (this.callbacks.onBuscar) {
      this.callbacks.onBuscar(termino, genero, disponibilidad);
    }
  }

  renderizar(libros) {
    if (libros.length === 0) {
      this.grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📚</div>
          <h3 class="empty-state-title">No se encontraron libros</h3>
          <p class="empty-state-message">Intenta con otros filtros o agrega nuevos libros.</p>
        </div>
      `;
      return;
    }

    this.grid.innerHTML = libros.map(libro => this.renderizarLibroCard(libro)).join('');
  }

  renderizarLibroCard(libro) {
    const titulo = sanitizarString(libro.titulo);
    const autor = sanitizarString(libro.autor);
    const descripcion = sanitizarString(libro.descripcion);

    return `
      <div class="libro-card" data-id="${libro.id}">
        <div class="libro-header">
          <div>
            <h3 class="libro-titulo">${titulo}</h3>
            <p class="libro-autor">por ${autor}</p>
          </div>
        </div>
        <span class="libro-genero">${libro.genero}</span>
        <p class="libro-descripcion">${descripcion}</p>
        <div class="libro-status ${libro.disponible ? 'disponible' : 'prestado'}">
          <span>${libro.disponible ? '✅ Disponible' : '❌ Prestado'}</span>
        </div>
        <div class="libro-actions">
          ${libro.disponible ? `
            <button class="btn btn-primary btn-sm" data-action="prestar" data-id="${libro.id}">
              <span class="icon">📖</span>
              Prestar
            </button>
          ` : `
            <button class="btn btn-secondary btn-sm" data-action="reservar" data-id="${libro.id}">
              <span class="icon">⏰</span>
              Reservar
            </button>
          `}
          <button class="btn btn-danger btn-sm" data-action="eliminar" data-id="${libro.id}">
            <span class="icon">🗑️</span>
            Eliminar
          </button>
        </div>
      </div>
    `;
  }

  handleAccion(e) {
    const button = e.target.closest('[data-action]');
    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.id;

    switch (action) {
      case 'eliminar':
        if (this.callbacks.onEliminarLibro) {
          this.callbacks.onEliminarLibro(id);
        }
        break;
      case 'prestar':
        if (this.callbacks.onPrestarLibro) {
          this.callbacks.onPrestarLibro(id);
        }
        break;
      case 'reservar':
        if (this.callbacks.onReservarLibro) {
          this.callbacks.onReservarLibro(id);
        }
        break;
    }
  }

  abrirModal() {
    this.modal.classList.add('active');
  }

  cerrarModal() {
    this.modal.classList.remove('active');
  }

  limpiarFormulario() {
    this.form.reset();
  }
}
