import { Request, Response } from 'express';
import { SriService } from '../services/sri.service';
import { prisma } from '../config/database';

export class SriController {
  private sriService: SriService;

  constructor() {
    this.sriService = new SriService();
  }

  public async getSriStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId as string;
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      const connection = await this.sriService.getSriConnectionStatus(user.id);
      res.status(200).json({
        success: true,
        data: {
          connected: connection.connected,
          connectionStatus: connection.connected ? 'connected' : 'disconnected',
          lastChecked: connection.lastChecked,
          ruc: user.ruc
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getSriHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId as string;
      const history = await this.sriService.getSriHistory(userId);
      res.status(200).json({
        success: true,
        data: history
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async connect(req: Request, res: Response): Promise<void> {
    try {
      const { ruc, password, additionalCi } = req.body;
      if (!ruc || !password) {
        res.status(400).json({ success: false, message: 'Missing required credentials' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { ruc }
      });

      if (!user) {
        res.status(404).json({ success: false, message: 'User with this RUC not found' });
        return;
      }

      await this.sriService.setSriConnection(user.id, true);

      res.status(200).json({
        success: true,
        message: 'SRI connection established successfully',
        data: {
          connected: true
        }
      });
    } catch (error) {
      console.error('SRI Connect error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
