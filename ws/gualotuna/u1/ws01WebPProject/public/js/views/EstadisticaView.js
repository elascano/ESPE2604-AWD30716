import { calcularPorcentaje } from '../utils/helpers.js';

export class EstadisticaView {
  constructor() {
    this.statTotalLibros = document.getElementById('stat-total-libros');
    this.statDisponibles = document.getElementById('stat-disponibles');
    this.statPrestamos = document.getElementById('stat-prestamos');
    this.statReservas = document.getElementById('stat-reservas');
    this.generosChart = document.getElementById('generos-chart');
  }

  renderizar(stats) {
    this.statTotalLibros.textContent = stats.totalLibros;
    this.statDisponibles.textContent = stats.disponibles;
    this.statPrestamos.textContent = stats.prestamosActivos;
    this.statReservas.textContent = stats.reservasPendientes;

    this.renderizarGraficoGeneros(stats.librosPorGenero);
  }

  renderizarGraficoGeneros(librosPorGenero) {
    const total = Object.values(librosPorGenero).reduce((sum, val) => sum + val, 0);

    if (total === 0) {
      this.generosChart.innerHTML = '<p style="color: var(--text-secondary);">No hay datos para mostrar</p>';
      return;
    }

    this.generosChart.innerHTML = Object.entries(librosPorGenero)
      .map(([genero, cantidad]) => {
        const porcentaje = calcularPorcentaje(cantidad, total);
        return `
          <div class="chart-bar">
            <span class="chart-label">${genero}</span>
            <div class="chart-progress">
              <div class="chart-fill" style="width: ${porcentaje}%">
                ${cantidad} (${porcentaje}%)
              </div>
            </div>
          </div>
        `;
      })
      .join('');
  }
}
