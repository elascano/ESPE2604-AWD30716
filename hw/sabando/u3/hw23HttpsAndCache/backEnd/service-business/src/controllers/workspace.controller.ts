import { Request, Response } from 'express';
import { crudClient } from '../http-client/crud.client';

export class WorkspaceController {
  public async getUserWorkspaces(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).currentUser.id;
      const result = await crudClient.get(`/repo/workspaces/${userId}`);
      res.status(200).json(result);
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async getWorkspaceDetail(req: Request, res: Response): Promise<void> {
    try {
      const { workspaceId } = req.params;
      const userId = (req as any).currentUser.id;
      const result = await crudClient.get(`/repo/workspaces/detail/${workspaceId}?userId=${userId}`);
      if (!result.data) { res.status(404).json({ success: false, message: 'Workspace not found' }); return; }
      res.status(200).json(result);
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async getInvoices(req: Request, res: Response): Promise<void> {
    try {
      const { workspaceId } = req.params;
      const userId = (req as any).currentUser.id;
      const result = await crudClient.get(`/repo/workspaces/invoices/${workspaceId}?userId=${userId}`);
      res.status(200).json(result);
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async getAtsFiles(req: Request, res: Response): Promise<void> {
    try {
      const { workspaceId } = req.params;
      const userId = (req as any).currentUser.id;
      const result = await crudClient.get(`/repo/workspaces/ats-files/${workspaceId}?userId=${userId}`);
      res.status(200).json(result);
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async getSummary(req: Request, res: Response): Promise<void> {
    try {
      const { workspaceId } = req.params;
      const userId = (req as any).currentUser.id;
      const [invoicesResult, atsResult] = await Promise.all([
        crudClient.get(`/repo/workspaces/invoices/${workspaceId}?userId=${userId}`),
        crudClient.get(`/repo/workspaces/ats-files/${workspaceId}?userId=${userId}`)
      ]);
      res.status(200).json({ success: true, data: { invoiceCount: invoicesResult.data?.length ?? 0, atsFileCount: atsResult.data?.length ?? 0 } });
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async getProcessStatus(req: Request, res: Response): Promise<void> {
    try {
      const { workspaceId } = req.params;
      const userId = (req as any).currentUser.id;
      const result = await crudClient.get(`/repo/workspaces/process-steps/${workspaceId}?userId=${userId}`);
      const steps: any[] = result.data || [];
      const find = (keyword: string) => steps.find((s: any) => s.title?.toLowerCase().includes(keyword) || s.description?.toLowerCase().includes(keyword));
      const invoiceStep = find('invoice'); const xlsmStep = find('xlsm'); const xmlStep = find('xml');
      res.status(200).json({ success: true, data: {
        invoiceDownloadStatus: invoiceStep?.status === 'completed',
        atsXlsmGenerationStatus: xlsmStep?.status === 'completed',
        atsXmlGenerationStatus: xmlStep?.status === 'completed'
      }});
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async getProcessSteps(req: Request, res: Response): Promise<void> {
    try {
      const { workspaceId } = req.params;
      const userId = (req as any).currentUser.id;
      const result = await crudClient.get(`/repo/workspaces/process-steps/${workspaceId}?userId=${userId}`);
      res.status(200).json(result);
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async getLogs(req: Request, res: Response): Promise<void> {
    try {
      const { workspaceId } = req.params;
      const userId = (req as any).currentUser.id;
      const result = await crudClient.get(`/repo/workspaces/logs/${workspaceId}?userId=${userId}`);
      res.status(200).json(result);
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async exportInvoices(req: Request, res: Response): Promise<void> {
    try {
      const { workspaceId } = req.params;
      const mockZip = Buffer.from([0x50, 0x4b, 0x05, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename=invoices_${workspaceId}.zip`);
      res.status(200).send(mockZip);
    } catch (error) { res.status(500).send('Internal server error'); }
  }

  public async downloadAtsXml(req: Request, res: Response): Promise<void> {
    try {
      const { workspaceId } = req.params;
      const userId = (req as any).currentUser.id;
      const userResult = await crudClient.get(`/repo/users/${userId}`);
      const ruc = userResult.data?.ruc || '1790011223002';
      const mockXml = `<?xml version="1.0" encoding="UTF-8"?>\n<ats>\n  <idInformante>${ruc}</idInformante>\n  <workspaceId>${workspaceId}</workspaceId>\n  <info>Reporte ATS generado para fines academicos</info>\n</ats>`;
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', `attachment; filename=ats_${workspaceId}.xml`);
      res.status(200).send(mockXml);
    } catch (error) { res.status(500).send('Internal server error'); }
  }

  public async downloadAtsXlsm(req: Request, res: Response): Promise<void> {
    try {
      const { workspaceId } = req.params;
      const mockExcel = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x08, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
      res.setHeader('Content-Type', 'application/vnd.ms-excel.sheet.macroEnabled.12');
      res.setHeader('Content-Disposition', `attachment; filename=ats_${workspaceId}.xlsm`);
      res.status(200).send(mockExcel);
    } catch (error) { res.status(500).send('Internal server error'); }
  }

  public async createWorkspace(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, period, workspaceLocation } = req.body;
      const userId = (req as any).currentUser.id;
      if (!period || !workspaceLocation) { res.status(400).json({ success: false, message: 'Missing required fields' }); return; }
      const result = await crudClient.post('/repo/workspaces', { name, description, period, workspaceLocation, userId });
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating workspace:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async downloadInvoicesAsync(req: Request, res: Response): Promise<void> {
    try {
      res.status(202).json({ success: true, message: 'Invoice download triggered', data: { invoiceDownloadStatus: false } });
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async generateAtsAsync(req: Request, res: Response): Promise<void> {
    try {
      res.status(202).json({ success: true, message: 'ATS generation triggered' });
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async deleteWorkspace(req: Request, res: Response): Promise<void> {
    try {
      const { workspaceId } = req.params;
      const result = await crudClient.delete(`/repo/workspaces/${workspaceId}`);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error deleting workspace:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
