export function generarId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function calcularDiferenciaDias(fecha1, fecha2) {
  return Math.ceil((fecha1 - fecha2) / (1000 * 60 * 60 * 24));
}

export function formatearFecha(fecha) {
  return fecha.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function sanitizarString(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function calcularPorcentaje(parte, total) {
  if (total === 0) return 0;
  return ((parte / total) * 100).toFixed(1);
}
