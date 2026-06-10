import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class SupportController {
  public async createTicket(req: Request, res: Response): Promise<void> {
    try {
      const { subject, category, priority, description, userId } = req.body;
      const actualUserId = userId || req.headers['x-user-id'] as string;
      
      if (!subject || !category || !priority || !description || !actualUserId) {
        res.status(400).json({ success: false, message: 'Missing required fields' });
        return;
      }

      const ticket = await prisma.ticket.create({
        data: {
          subject,
          category,
          priority,
          description,
          userId: actualUserId
        }
      });

      res.status(201).json({ success: true, message: 'Ticket creado exitosamente', data: ticket });
    } catch (error) {
      console.error('Error creating ticket:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getUserTickets(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        res.status(400).json({ success: false, message: 'Missing user ID' });
        return;
      }

      const tickets = await prisma.ticket.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      res.status(200).json({ success: true, data: tickets });
    } catch (error) {
      console.error('Error fetching tickets:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
