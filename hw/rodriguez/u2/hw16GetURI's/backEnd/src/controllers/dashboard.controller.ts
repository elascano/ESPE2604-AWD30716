import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class DashboardController {
  public async getSummary(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId as string;
      
      const invoicesCount = await prisma.invoice.count({
        where: { userId }
      });
      
      const atsWithErrorsCount = await prisma.atsFile.count({
        where: { 
          userId, 
          validationErrors: { gt: 0 } 
        }
      });

      const today = new Date();
      
      res.status(200).json({
        success: true,
        data: {
          invoicesDownloaded: invoicesCount,
          invoicesDownloadedChange: 5,
          errorsDetected: atsWithErrorsCount,
          lastSync: today.toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' }),
          notifications: [
            { id: 'n1', type: 'info', title: 'Bienvenido', message: 'Sistema conectado correctamente', timestamp: 'Ahora', read: false }
          ]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
