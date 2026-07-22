import { Request, Response } from 'express';
import { crudClient } from '../http-client/crud.client';

export class DashboardController {
  public async getSummary(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const [invoicesResult, atsErrorsResult] = await Promise.all([
        crudClient.get(`/repo/invoices/count/${userId}`),
        crudClient.get(`/repo/ats/errors/count/${userId}`)
      ]);

      res.status(200).json({
        success: true,
        data: {
          invoicesDownloaded: invoicesResult.data?.count ?? 0,
          invoicesDownloadedChange: 5,
          errorsDetected: atsErrorsResult.data?.count ?? 0,
          lastSync: new Date().toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' }),
          notifications: [
            { id: 'n1', type: 'info', title: 'Bienvenido', message: 'Sistema conectado correctamente', timestamp: 'Ahora', read: false }
          ]
        }
      });
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }
}
