import { Request, Response } from 'express';
import { InvoiceService } from '../services/invoice.service';

export class InvoiceController {
  private invoiceService: InvoiceService;

  constructor() {
    this.invoiceService = new InvoiceService();
  }

  public async getUserInvoices(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const invoices = await this.invoiceService.getInvoicesByUser(userId as string);
      res.status(200).json({ success: true, data: invoices });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async uploadInvoices(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { invoices } = req.body;

      if (!invoices || !Array.isArray(invoices)) {
        res.status(400).json({ success: false, message: 'Invalid data format' });
        return;
      }

      const savedInvoices = await this.invoiceService.saveInvoices(userId as string, invoices);
      res.status(201).json({ success: true, data: savedInvoices });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getSummary(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const summary = await this.invoiceService.getInvoiceSummary(userId as string);
      res.status(200).json({ success: true, data: summary });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
