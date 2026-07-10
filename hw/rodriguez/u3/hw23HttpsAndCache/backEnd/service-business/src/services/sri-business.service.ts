import { crudClient } from '../http-client/crud.client';

/**
 * SriBusinessService — Lógica de negocio para la integración SRI.
 * Gestiona el caché en memoria de sesiones activas y determina el estado de conexión
 * sin acceder directamente a la base de datos.
 */
export class SriBusinessService {
  // Caché en memoria: userId → { connected, lastChecked }
  private static activeSessions = new Map<string, { connected: boolean; lastChecked: Date }>();

  /**
   * Determina si la conexión SRI sigue activa basándose en el último evento registrado.
   * La ventana de validez es de 24 horas.
   */
  public isWithin24Hours(timestamp: Date | string | null): boolean {
    if (!timestamp) return false;
    const elapsed = new Date().getTime() - new Date(timestamp).getTime();
    return elapsed < 24 * 60 * 60 * 1000;
  }

  /**
   * Obtiene el estado de conexión SRI para un usuario.
   * Prioriza el caché en memoria; si no existe, consulta el Servicio B.
   */
  public async getConnectionStatus(userId: string): Promise<{ connected: boolean; lastChecked: Date }> {
    if (SriBusinessService.activeSessions.has(userId)) {
      return SriBusinessService.activeSessions.get(userId)!;
    }

    // Consulta el último evento SRI_CONNECT al Servicio B
    const result = await crudClient.get(`/repo/sri/status/${userId}`);
    const lastConnect = result?.data;

    if (lastConnect && this.isWithin24Hours(lastConnect.timestamp)) {
      const session = { connected: true, lastChecked: new Date(lastConnect.timestamp) };
      SriBusinessService.activeSessions.set(userId, session);
      return session;
    }

    const session = { connected: false, lastChecked: new Date() };
    SriBusinessService.activeSessions.set(userId, session);
    return session;
  }

  /**
   * Establece el estado de conexión en el caché y persiste el evento en el Servicio B.
   */
  public async setConnection(userId: string, connected: boolean): Promise<void> {
    SriBusinessService.activeSessions.set(userId, { connected, lastChecked: new Date() });
    await crudClient.post('/repo/sri/connect', { userId, connected });
  }
}
