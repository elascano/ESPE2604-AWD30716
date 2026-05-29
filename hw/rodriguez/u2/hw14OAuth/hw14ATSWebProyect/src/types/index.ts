export type UserRole = 'accountant' | 'admin';

export type SriConnectionStatus = 'connected' | 'disconnected' | 'pending';

export type ProcessStepStatus = 'completed' | 'pending' | 'blocked' | 'in-progress';

export type InvoiceFormat = 'XML' | 'PDF';

export type TaxPeriodType = 'monthly' | 'semi-annual';

export type AtsFileFormat = 'XLSM' | 'XML';

export type ValidationLogLevel = 'error' | 'warning' | 'info';

export interface User {
  id: string;
  ruc: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  role: UserRole;
  createdAt: string;
}

export interface SriCredentials {
  username: string;
  password: string;
}

export interface TaxPeriod {
  type: TaxPeriodType;
  month?: number;
  semester?: 1 | 2;
  year: number;
}

export interface Invoice {
  id: string;
  number: string;
  issuerRuc: string;
  issuerName: string;
  date: string;
  total: number;
  taxBase: number;
  iva: number;
  format: InvoiceFormat;
  period: TaxPeriod;
}

export interface ValidationLogEntry {
  id: string;
  level: ValidationLogLevel;
  field: string;
  message: string;
  row?: number;
}

export interface AtsFile {
  id: string;
  name: string;
  format: AtsFileFormat;
  period: TaxPeriod;
  createdAt: string;
  invoiceCount: number;
  validationErrors: number;
  downloadUrl?: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  status: ProcessStepStatus;
  completedAt?: string;
  module: string;
}

export interface AuditEvent {
  id: string;
  userId: string;
  action: string;
  module: string;
  timestamp: string;
  details: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface DashboardSummary {
  invoicesDownloaded: number;
  invoicesDownloadedChange: number;
  errorsDetected: number;
  atsReadyToGenerate: boolean;
  sriStatus: SriConnectionStatus;
  lastSync: string;
  notifications: Notification[];
}
