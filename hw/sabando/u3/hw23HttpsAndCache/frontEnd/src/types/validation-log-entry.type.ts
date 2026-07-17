export type ValidationLogLevel = 'error' | 'warning' | 'info';

export interface ValidationLogEntry {
  id: string;
  level: ValidationLogLevel;
  field: string;
  message: string;
  row?: number;
}
