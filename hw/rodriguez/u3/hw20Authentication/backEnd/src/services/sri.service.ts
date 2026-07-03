import { prisma } from '../config/database';

export class SriService {
  // Simple in-memory session cache mapping userId to SRI connection details
  private static activeSessions = new Map<string, { connected: boolean, lastChecked: Date }>();

  public async getSriConnectionStatus(userId: string) {
    // If not in cache, default to disconnected
    if (!SriService.activeSessions.has(userId)) {
      // Check if they had a recent success connection in AuditEvent to persist mock connection
      const lastConnect = await prisma.auditEvent.findFirst({
        where: { userId, action: 'SRI_CONNECT' },
        orderBy: { timestamp: 'desc' }
      });
      
      if (lastConnect && (new Date().getTime() - new Date(lastConnect.timestamp).getTime()) < 24 * 60 * 60 * 1000) {
        SriService.activeSessions.set(userId, { connected: true, lastChecked: new Date(lastConnect.timestamp) });
      } else {
        SriService.activeSessions.set(userId, { connected: false, lastChecked: new Date() });
      }
    }
    
    return SriService.activeSessions.get(userId)!;
  }

  public async setSriConnection(userId: string, connected: boolean) {
    SriService.activeSessions.set(userId, { connected, lastChecked: new Date() });
    
    // Log to Audit Event
    await prisma.auditEvent.create({
      data: {
        action: connected ? 'SRI_CONNECT' : 'SRI_DISCONNECT',
        module: 'Integración SRI',
        details: connected ? 'Vinculación exitosa con portal SRI en línea' : 'Sesión con SRI finalizada',
        userId
      }
    });
  }

  public async getSriHistory(userId: string) {
    return prisma.auditEvent.findMany({
      where: {
        userId,
        module: 'Integración SRI'
      },
      orderBy: { timestamp: 'desc' }
    });
  }
}
