import { Request, Response } from 'express';
import { crudClient } from '../http-client/crud.client';

export class TaxpayerController {
  public async getAllTaxpayers(req: Request, res: Response): Promise<void> {
    try {
      const result = await crudClient.get('/repo/users');
      res.status(200).json(result);
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const result = await crudClient.get(`/repo/users/${req.params.userId}`);
      if (!result.data) { res.status(404).json({ success: false, message: 'User not found' }); return; }
      const u = result.data;
      res.status(200).json({ success: true, data: { id: u.id, ruc: u.ruc, firstName: u.firstName, lastName: u.lastName, email: u.email, role: u.role, createdAt: u.createdAt } });
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async getStats(req: Request, res: Response): Promise<void> {
    try {
      const userResult = await crudClient.get(`/repo/users/${req.params.userId}`);
      if (!userResult.data) { res.status(404).json({ success: false, message: 'User not found' }); return; }

      const userId = req.params.userId;
      const [workspacesResult, invoicesResult, lastSyncResult] = await Promise.all([
        crudClient.get(`/repo/workspaces/${userId}`),
        crudClient.get(`/repo/invoices/count/${userId}`),
        crudClient.get(`/repo/audit/action/${userId}/INVOICES_DOWNLOAD`)
      ]);

      res.status(200).json({
        success: true,
        data: {
          workspacesCount: workspacesResult.data?.length ?? 0,
          totalInvoices: invoicesResult.data?.count ?? 0,
          lastSriSync: lastSyncResult.data?.timestamp ?? null
        }
      });
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async validateRuc(req: Request, res: Response): Promise<void> {
    try {
      const ruc = req.params.ruc;
      if (!ruc || ruc.length !== 13) { res.status(200).json({ success: true, valid: false, exists: false }); return; }
      const result = await crudClient.get(`/repo/users/ruc/${ruc}`);
      res.status(200).json({ success: true, valid: true, exists: !!result.data });
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { firstName, lastName } = req.body;
      const result = await crudClient.put(`/repo/users/${req.params.userId}`, { firstName, lastName });
      const u = result.data;
      res.status(200).json({ success: true, data: { id: u.id, ruc: u.ruc, firstName: u.firstName, lastName: u.lastName, email: u.email } });
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }
}
