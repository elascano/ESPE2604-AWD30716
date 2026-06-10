import { Request, Response } from 'express';
import { TraceabilityService } from '../services/traceability.service';

export class TraceabilityController {
  private traceabilityService: TraceabilityService;

  constructor() {
    this.traceabilityService = new TraceabilityService();
  }

  public async getAuditLog(req: Request, res: Response): Promise<void> {
    try {
      const events = await this.traceabilityService.getAuditEvents();
      res.status(200).json({ success: true, data: events });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async logAction(req: Request, res: Response): Promise<void> {
    try {
      const { action, module, details, userId } = req.body;
      const event = await this.traceabilityService.logEvent({ action, module, details, userId });
      res.status(201).json({ success: true, data: event });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getUserProcessSteps(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const steps = await this.traceabilityService.getProcessSteps(userId as string);
      res.status(200).json({ success: true, data: steps });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async updateStep(req: Request, res: Response): Promise<void> {
    try {
      const { stepId } = req.params;
      const { status } = req.body;
      const completedAt = status === 'completed' ? new Date() : undefined;
      
      const step = await this.traceabilityService.updateProcessStep(stepId as string, status, completedAt);
      res.status(200).json({ success: true, data: step });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
