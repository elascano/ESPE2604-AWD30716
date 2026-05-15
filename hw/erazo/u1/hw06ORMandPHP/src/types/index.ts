/**
 * Tipos TypeScript del sistema médico
 * Adaptado del sistema de gestión de riesgos
 */

// ============================================
// TIPOS DE USUARIO Y AUTENTICACIÓN
// ============================================

export type UserRole = 'paciente' | 'medico' | 'admin';

export type TipoSeguro = 
  | 'ninguno'
  | 'iess'
  | 'ejercito'
  | 'policia'
  | 'privado'
  | 'issfa'
  | 'isspol';

export interface User {
  id: number | string;
  cedula: string;           // Usuario = cédula
  username: string;         // Igual a cédula
  email?: string;
  fullName: string;         // Nombres completos
  role: UserRole;
  direccion?: string;
  edad?: number;
  sexo?: 'masculino' | 'femenino' | 'otro';
  tieneSeguro: boolean;     // DEPRECATED: usar tipoSeguro
  tipoSeguro: TipoSeguro;   // Tipo de seguro del usuario
  telefono?: string;
  avatar?: string;
  fotoPerfil?: string | null;
  
  // Campos específicos para médicos
  especialidad?: string;
  numeroLicencia?: string;
  
  // Campos de auditoría
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  cedula: string;
  password: string;
}

export interface RegisterData {
  nombresCompletos: string;
  cedula: string;
  password: string;
  direccion: string;
  edad: number;
  sexo: 'masculino' | 'femenino' | 'otro';
  tipoSeguro: TipoSeguro;
  telefono?: string;
  email?: string;
}

export interface LoginResult {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

// ============================================
// TIPOS DE TERAPIAS
// ============================================

export interface Terapia {
  id: number | string;
  nombre: string;
  descripcion: string;
  duracion: number;          // Duración en minutos
  precio: number;
  imagen?: string;
  especialidad: string;
  activa: boolean;
  
  // Campos de auditoría
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// TIPOS DE CITAS
// ============================================

export type EstadoCita = 'pendiente' | 'confirmada' | 'completada' | 'cancelada';

export interface Cita {
  id: number | string;
  pacienteId: number | string;
  medicoId: number | string;
  terapiaId: number | string;
  
  // Información de la cita
  fecha: string;             // ISO date string
  hora: string;              // HH:mm format
  estado: EstadoCita;
  
  // Información del formulario
  sintomas: string;
  tieneExamenes: boolean;
  examenes?: ArchivoExamen[];
  
  // Información adicional
  notas?: string;
  motivoCancelacion?: string;
  
  // Relaciones (para poblar)
  paciente?: User;
  medico?: User;
  terapia?: Terapia;
  
  // Campos de auditoría
  createdAt?: string;
  updatedAt?: string;
}

export interface ArchivoExamen {
  id: string;
  nombre: string;
  tipo: string;
  url: string;
  tamaño: number;
  fechaSubida: string;
}

export interface HorarioDisponible {
  fecha: string;             // ISO date string
  hora: string;              // HH:mm format
  disponible: boolean;
  medicoId: number | string;
  medicoNombre?: string;
}

// ============================================
// TIPOS DE FORMULARIOS
// ============================================

export interface AppointmentFormData {
  // Paso 1: Calendario
  fecha: string;
  hora: string;
  medicoId: number | string;
  
  // Paso 2: Formulario
  sintomas: string;
  tieneExamenes: boolean;
  examenes?: File[];
  
  // Paso 3: Confirmación (datos calculados)
  terapiaId: number | string;
}

// ============================================
// TIPOS DE DASHBOARD
// ============================================

export interface DashboardStats {
  proximasCitas: number;
  citasCompletadas: number;
  citasPendientes: number;
  terapiasDisponibles: number;
}

export interface ProximaCita {
  id: number | string;
  fecha: string;
  hora: string;
  terapiaNombre: string;
  medicoNombre: string;
  estado: EstadoCita;
}

// ============================================
// TIPOS DE MÉDICOS
// ============================================

export interface Medico extends User {
  role: 'medico';
  especialidad: string;
  numeroLicencia: string;
  horarioAtencion?: HorarioAtencion[];
  calificacion?: number;
  pacientesAtendidos?: number;
}

export interface HorarioAtencion {
  diaSemana: number;         // 0 = Domingo, 6 = Sábado
  horaInicio: string;        // HH:mm format
  horaFin: string;           // HH:mm format
}

// ============================================
// TIPOS DE RESPUESTAS API
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// TIPOS DE CONTEXTOS
// ============================================

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  register: (data: RegisterData) => Promise<LoginResult>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  
  // Helpers de roles
  esAdmin: boolean;
  esPaciente: boolean;
  esMedico: boolean;
}

// ============================================
// TIPOS DE RUTAS
// ============================================

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  roles?: UserRole[];
  children?: RouteConfig[];
}

// ============================================
// TIPOS DE NOTIFICACIONES
// ============================================

export interface Notificacion {
  id: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  titulo: string;
  mensaje: string;
  leida: boolean;
  fecha: string;
  accion?: {
    texto: string;
    url: string;
  };
}

export default {};
