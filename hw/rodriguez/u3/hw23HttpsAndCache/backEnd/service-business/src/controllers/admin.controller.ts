import { Request, Response } from 'express';
import { crudClient } from '../http-client/crud.client';

export class AdminController {
  public async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const result = await crudClient.get('/repo/users');
      res.status(200).json(result);
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async updateUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { status } = req.body;
      if (!status) { res.status(400).json({ success: false, message: 'Status is required' }); return; }
      res.status(200).json({ success: true, message: `User status updated to ${status}` });
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const result = await crudClient.delete(`/repo/users/${userId}`);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getAuditLogs(req: Request, res: Response): Promise<void> {
    try {
      const result = await crudClient.get('/repo/audit/all/logs');
      res.status(200).json(result);
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async updateSettings(req: Request, res: Response): Promise<void> {
    try {
      const { sriTargetUrl, maxDownloadThreads } = req.body;
      res.status(200).json({ success: true, message: 'Global settings updated successfully', data: { sriTargetUrl, maxDownloadThreads } });
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async getTickets(req: Request, res: Response): Promise<void> {
    try {
      const result = await crudClient.get('/repo/tickets');
      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching global tickets:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async updateTicketStatus(req: Request, res: Response): Promise<void> {
    try {
      const { ticketId } = req.params;
      const { status } = req.body;
      if (!status) { res.status(400).json({ success: false, message: 'Status is required' }); return; }
      const result = await crudClient.put(`/repo/tickets/${ticketId}/status`, { status });
      res.status(200).json({ success: true, message: `Ticket status updated to ${status}`, data: result.data });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
