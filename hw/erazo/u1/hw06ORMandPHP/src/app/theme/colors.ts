/**
 * Paleta de colores del sistema médico
 * Adaptado del sistema de gestión de riesgos para contexto médico
 */

export const colors = {
  // Colores principales - Tonos médicos profesionales
  primary: {
    main: '#2196F3',      // Azul médico profesional
    light: '#64B5F6',
    dark: '#1976D2',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#00897B',      // Verde médico (salud)
    light: '#4DB6AC',
    dark: '#00695C',
    contrastText: '#FFFFFF',
  },
  
  // Colores de estado de citas
  appointment: {
    pending: { main: '#FFA726', light: '#FFB74D', dark: '#F57C00' },     // Naranja - Pendiente
    confirmed: { main: '#66BB6A', light: '#81C784', dark: '#388E3C' },   // Verde - Confirmada
    completed: { main: '#42A5F5', light: '#64B5F6', dark: '#1976D2' },   // Azul - Completada
    cancelled: { main: '#EF5350', light: '#E57373', dark: '#D32F2F' },   // Rojo - Cancelada
  },
  
  // Colores de prioridad médica
  priority: {
    urgent: { main: '#D32F2F', light: '#E57373', dark: '#B71C1C' },      // Rojo - Urgente
    high: { main: '#F57C00', light: '#FF9800', dark: '#E65100' },        // Naranja - Alta
    normal: { main: '#FBC02D', light: '#FDD835', dark: '#F9A825' },      // Amarillo - Normal
    low: { main: '#388E3C', light: '#66BB6A', dark: '#2E7D32' },         // Verde - Baja
  },
  
  // Fondos y superficies
  background: {
    default: '#F5F7FA',   // Gris muy claro para fondo exterior
    paper: '#FFFFFF',     // Blanco para contenido
    elevated: '#FFFFFF',  // Blanco para elementos elevados
    sidebar: '#1E293B',   // Gris oscuro para sidebar
  },
  
  // Textos
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.60)',
    disabled: 'rgba(0, 0, 0, 0.38)',
    hint: 'rgba(0, 0, 0, 0.38)',
  },
  
  // Colores de especialidades médicas (para iconos/badges)
  specialty: {
    general: '#2196F3',
    cardiology: '#E91E63',
    neurology: '#9C27B0',
    pediatrics: '#FF9800',
    orthopedics: '#795548',
    dermatology: '#00BCD4',
    psychiatry: '#673AB7',
    therapy: '#4CAF50',
  },
  
  // Colores de acción
  action: {
    active: 'rgba(0, 0, 0, 0.54)',
    hover: 'rgba(0, 0, 0, 0.04)',
    selected: 'rgba(0, 0, 0, 0.08)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
  },
  
  // Colores de éxito, error, advertencia, info
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#F44336',
    light: '#E57373',
    dark: '#D32F2F',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  info: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
    contrastText: '#FFFFFF',
  },
  
  // Dividers
  divider: 'rgba(0, 0, 0, 0.12)',
};

export default colors;
