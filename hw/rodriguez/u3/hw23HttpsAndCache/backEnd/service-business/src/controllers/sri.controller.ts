import { Request, Response } from 'express';
import { crudClient } from '../http-client/crud.client';
import { SriBusinessService } from '../services/sri-business.service';

export class SriController {
  private sriBusinessService = new SriBusinessService();

  public async getSriStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const userResult = await crudClient.get(`/repo/users/${userId}`);
      if (!userResult.data) { res.status(404).json({ success: false, message: 'User not found' }); return; }

      // Business logic: session cache + 24h window check
      const connection = await this.sriBusinessService.getConnectionStatus(userId as string);
      res.status(200).json({
        success: true,
        data: { connected: connection.connected, connectionStatus: connection.connected ? 'connected' : 'disconnected', lastChecked: connection.lastChecked, ruc: userResult.data.ruc }
      });
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async getSriHistory(req: Request, res: Response): Promise<void> {
    try {
      const result = await crudClient.get(`/repo/sri/history/${req.params.userId}`);
      res.status(200).json(result);
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async connect(req: Request, res: Response): Promise<void> {
    try {
      const { ruc, password } = req.body;
      if (!ruc || !password) { res.status(400).json({ success: false, message: 'Missing required credentials' }); return; }

      const userResult = await crudClient.get(`/repo/users/ruc/${ruc}`);
      if (!userResult.data) { res.status(404).json({ success: false, message: 'User with this RUC not found' }); return; }

      // Business logic: update session cache + persist event in Servicio B
      await this.sriBusinessService.setConnection(userResult.data.id, true);
      res.status(200).json({ success: true, message: 'SRI connection established successfully', data: { connected: true } });
    } catch (error) {
      console.error('SRI Connect error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
