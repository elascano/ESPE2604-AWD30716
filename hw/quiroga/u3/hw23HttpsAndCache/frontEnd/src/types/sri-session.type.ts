export type SriConnectionStatus = 'connected' | 'disconnected' | 'pending';

export interface SriSession {
  RUC: string;
  additionalCi: string;
  password: string;
  connectionStatus: SriConnectionStatus;
}
