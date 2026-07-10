import { Request, Response } from 'express';
import { WorkspaceService } from '../services/workspace.service';
import { prisma } from '../config/database';

export class WorkspaceController {
  private workspaceService: WorkspaceService;

  constructor() {
    this.workspaceService = new WorkspaceService();
  }

  public async getWorkspaces(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId as string;
      const workspaces = await this.workspaceService.getUserWorkspaces(userId);
      res.status(200).json({ success: true, data: workspaces });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getWorkspaceDetail(req: Request, res: Response): Promise<void> {
    try {
      const workspaceId = req.params.workspaceId as string;
      const userId = (req as any).currentUser.id;

      const workspace = await this.workspaceService.getWorkspaceById(workspaceId, userId);
      if (!workspace) {
        res.status(404).json({ success: false, message: 'Workspace not found' });
        return;
      }

      res.status(200).json({ success: true, data: workspace });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getInvoices(req: Request, res: Response): Promise<void> {
    try {
      const workspaceId = req.params.workspaceId as string;
      const userId = (req as any).currentUser.id;

      const invoices = await this.workspaceService.getWorkspaceInvoices(workspaceId, userId);
      res.status(200).json({ success: true, data: invoices });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getAtsFiles(req: Request, res: Response): Promise<void> {
    try {
      const workspaceId = req.params.workspaceId as string;
      const userId = (req as any).currentUser.id;

      const atsFiles = await this.workspaceService.getWorkspaceAtsFiles(workspaceId, userId);
      res.status(200).json({ success: true, data: atsFiles });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getSummary(req: Request, res: Response): Promise<void> {
    try {
      const workspaceId = req.params.workspaceId as string;
      const userId = (req as any).currentUser.id;

      const summary = await this.workspaceService.getWorkspaceSummary(workspaceId, userId);
      res.status(200).json({ success: true, data: summary });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getProcessStatus(req: Request, res: Response): Promise<void> {
    try {
      const workspaceId = req.params.workspaceId as string;
      const userId = (req as any).currentUser.id;

      const status = await this.workspaceService.getWorkspaceProcessStatus(workspaceId, userId);
      res.status(200).json({ success: true, data: status });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getProcessSteps(req: Request, res: Response): Promise<void> {
    try {
      const workspaceId = req.params.workspaceId as string;
      const userId = (req as any).currentUser.id;

      const steps = await this.workspaceService.getWorkspaceProcessSteps(workspaceId, userId);
      res.status(200).json({ success: true, data: steps });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getLogs(req: Request, res: Response): Promise<void> {
    try {
      const workspaceId = req.params.workspaceId as string;
      const userId = (req as any).currentUser.id;

      const logs = await this.workspaceService.getWorkspaceLogs(workspaceId, userId);
      res.status(200).json({ success: true, data: logs });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async exportInvoices(req: Request, res: Response): Promise<void> {
    try {
      const workspaceId = req.params.workspaceId as string;

      // Mock empty zip file buffer (Minimal valid zip file)
      const mockZip = Buffer.from([
        0x50, 0x4b, 0x05, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ]);

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename=invoices_${workspaceId}.zip`);
      res.status(200).send(mockZip);
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  public async downloadAtsXml(req: Request, res: Response): Promise<void> {
    try {
      const workspaceId = req.params.workspaceId as string;
      const userId = (req as any).currentUser.id;

      let ruc = '1790011223002';
      if (userId) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user) ruc = user.ruc;
      }

      const mockXml = `<?xml version="1.0" encoding="UTF-8"?>
<ats>
  <idInformante>${ruc}</idInformante>
  <workspaceId>${workspaceId}</workspaceId>
  <info>Reporte ATS generado para fines academicos</info>
</ats>`;

      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', `attachment; filename=ats_${workspaceId}.xml`);
      res.status(200).send(mockXml);
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  public async downloadAtsXlsm(req: Request, res: Response): Promise<void> {
    try {
      const workspaceId = req.params.workspaceId as string;

      // Mock Excel XLSM binary header structure or empty Excel file
      const mockExcel = Buffer.from([
        0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x08, 0x00, 0x08, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ]);

      res.setHeader('Content-Type', 'application/vnd.ms-excel.sheet.macroEnabled.12');
      res.setHeader('Content-Disposition', `attachment; filename=ats_${workspaceId}.xlsm`);
      res.status(200).send(mockExcel);
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  public async createWorkspace(req: Request, res: Response): Promise<void> {
    try {
      const { period, workspaceLocation } = req.body;
      const userId = (req as any).currentUser.id;
      if (!period || !workspaceLocation) {
        res.status(400).json({ success: false, message: 'Missing required fields' });
        return;
      }
      
      const newWorkspace = await prisma.workspace.create({
        data: {
          name: `Workspace ${period}`,
          periodYear: parseInt(period.split('-')[0]),
          periodMonth: parseInt(period.split('-')[1]),
          workspaceLocation,
          userId
        }
      });
      res.status(201).json({ success: true, data: newWorkspace });
    } catch (error) {
      console.error("Error creating workspace:", error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async downloadInvoicesAsync(req: Request, res: Response): Promise<void> {
    try {
      res.status(202).json({
        success: true,
        message: 'Invoice download triggered',
        data: { invoiceDownloadStatus: false }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async generateAtsAsync(req: Request, res: Response): Promise<void> {
    try {
      res.status(202).json({
        success: true,
        message: 'ATS generation triggered'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async deleteWorkspace(req: Request, res: Response): Promise<void> {
    try {
      const workspaceId = req.params.workspaceId as string;
      // In a real application, you would also need to delete related records
      // like invoices, atsFiles, processSteps if onDelete: Cascade is not set in Prisma
      await prisma.workspace.delete({
        where: { id: workspaceId }
      });
      res.status(200).json({ success: true, message: 'Workspace deleted successfully' });
    } catch (error) {
      console.error("Error deleting workspace:", error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
