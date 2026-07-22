import { Request, Response } from 'express';
import { crudClient } from '../http-client/crud.client';

export class SupportController {
  public async createTicket(req: Request, res: Response): Promise<void> {
    try {
      const { subject, category, priority, description, userId } = req.body;
      const actualUserId = userId || (req as any).currentUser.id;
      if (!subject || !category || !priority || !description || !actualUserId) {
        res.status(400).json({ success: false, message: 'Missing required fields' }); return;
      }
      const result = await crudClient.post('/repo/tickets', { subject, category, priority, description, userId: actualUserId });
      res.status(201).json({ success: true, message: 'Ticket creado exitosamente', data: result.data });
    } catch (error) {
      console.error('Error creating ticket:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getUserTickets(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).currentUser.id;
      if (!userId) { res.status(400).json({ success: false, message: 'Missing user ID' }); return; }
      const result = await crudClient.get(`/repo/tickets/${userId}`);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
