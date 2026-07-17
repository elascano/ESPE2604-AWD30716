import { Request, Response } from 'express';
import { crudClient } from '../http-client/crud.client';

export class TraceabilityController {
  public async getAuditLog(req: Request, res: Response): Promise<void> {
    try {
      const result = await crudClient.get('/repo/audit/all/logs');
      res.status(200).json(result);
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async logAction(req: Request, res: Response): Promise<void> {
    try {
      const { action, module, details, userId } = req.body;
      const result = await crudClient.post('/repo/audit', { action, module, details, userId });
      res.status(201).json(result);
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async getUserProcessSteps(req: Request, res: Response): Promise<void> {
    try {
      const result = await crudClient.get(`/repo/process-steps/${req.params.userId}`);
      res.status(200).json(result);
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async updateStep(req: Request, res: Response): Promise<void> {
    try {
      const { stepId } = req.params;
      const { status } = req.body;
      const result = await crudClient.put(`/repo/process-steps/${stepId}`, { status });
      res.status(200).json(result);
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }
}
