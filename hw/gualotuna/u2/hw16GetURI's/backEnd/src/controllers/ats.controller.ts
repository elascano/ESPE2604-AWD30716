import { Request, Response } from 'express';
import { AtsService } from '../services/ats.service';

export class AtsController {
  private atsService: AtsService;

  constructor() {
    this.atsService = new AtsService();
  }

  public async getUserAts(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const atsFiles = await this.atsService.getAtsFilesByUser(userId as string);
      res.status(200).json({ success: true, data: atsFiles });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async saveAts(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const data = { ...req.body, userId: userId as string };
      
      const newAts = await this.atsService.saveAtsFile(data);
      res.status(201).json({ success: true, data: newAts });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
