export const GENEROS = [
  "Ficción",
  "No Ficción",
  "Ciencia",
  "Historia",
  "Tecnología",
  "Fantasía",
];

export const ESTADOS_PRESTAMO = {
  ACTIVO: "activo",
  PROXIMO: "proximo",
  VENCIDO: "vencido",
};

export const ESTADOS_RESERVA = {
  PENDIENTE: "pendiente",
  COMPLETADA: "completada",
  CANCELADA: "cancelada",
};

export const TIPOS_NOTIFICACION = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

export const TIEMPOS = {
  VERIFICACION_PRESTAMOS: 60000,
  NOTIFICACION_AUTO_CIERRE: 5000,
  SIMULACION_PRESTAMO: 1500,
  SIMULACION_DEVOLUCION: 1000,
  SIMULACION_RESERVA: 1200,
  SIMULACION_EMAIL: 500,
};

export const DIAS = {
  RECORDATORIO_ANTES: 2,
  PRESTAMO_PROXIMO_VENCER: 3,
  PRESTAMO_MINIMO: 1,
  PRESTAMO_MAXIMO: 30,
  PRESTAMO_DEFAULT: 7,
};
