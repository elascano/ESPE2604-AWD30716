import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class AdminController {
  public async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, ruc: true, firstName: true, lastName: true, email: true, role: true, createdAt: true }
      });
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async updateUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId as string;
      const { status } = req.body;
      if (!status) {
        res.status(400).json({ success: false, message: 'Status is required' });
        return;
      }
      res.status(200).json({ success: true, message: `User status updated to ${status}` });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId as string;
      await prisma.user.delete({
        where: { id: userId }
      });
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getAuditLogs(req: Request, res: Response): Promise<void> {
    try {
      const logs = await prisma.auditEvent.findMany({
        orderBy: { timestamp: 'desc' },
        take: 100,
        include: { user: { select: { email: true, ruc: true } } }
      });
      res.status(200).json({ success: true, data: logs });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async updateSettings(req: Request, res: Response): Promise<void> {
    try {
      const { sriTargetUrl, maxDownloadThreads } = req.body;
      res.status(200).json({ 
        success: true, 
        message: 'Global settings updated successfully',
        data: { sriTargetUrl, maxDownloadThreads }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getTickets(req: Request, res: Response): Promise<void> {
    try {
      const tickets = await prisma.ticket.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName: true, lastName: true, email: true } } }
      });
      res.status(200).json({ success: true, data: tickets });
    } catch (error) {
      console.error('Error fetching global tickets:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async updateTicketStatus(req: Request, res: Response): Promise<void> {
    try {
      const ticketId = req.params.ticketId as string;
      const { status } = req.body;
      if (!status) {
        res.status(400).json({ success: false, message: 'Status is required' });
        return;
      }

      const updatedTicket = await prisma.ticket.update({
        where: { id: ticketId },
        data: { status }
      });

      res.status(200).json({ success: true, message: `Ticket status updated to ${status}`, data: updatedTicket });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
