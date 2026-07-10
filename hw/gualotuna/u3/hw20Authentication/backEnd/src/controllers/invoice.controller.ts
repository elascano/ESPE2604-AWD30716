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

  public async downloadInvoices(req: Request, res: Response): Promise<void> {
    try {
      const { ruc } = req.params;
      const { periodType, month, semester, year } = req.query;

      if (!ruc) {
        res.status(400).json({ success: false, message: 'RUC is required' });
        return;
      }

      const { prisma } = require('../config/database');
      
      const filters: any = {
        customerId: ruc
      };

      let invoices = await prisma.invoice.findMany({ where: filters });
      let filteredInvoices = invoices;
      
      if (year) {
        if (periodType === 'monthly' && month) {
          const m = String(month).padStart(2, '0');
          const prefix = `${year}-${m}-`;
          filteredInvoices = filteredInvoices.filter((inv: any) => inv.customerDate.startsWith(prefix));
        } else if (periodType === 'semi-annual' && semester) {
          const isFirstSem = String(semester) === '1';
          filteredInvoices = filteredInvoices.filter((inv: any) => {
            const dateYear = inv.customerDate.substring(0, 4);
            const dateMonth = parseInt(inv.customerDate.substring(5, 7));
            if (dateYear !== String(year)) return false;
            return isFirstSem ? (dateMonth >= 1 && dateMonth <= 6) : (dateMonth >= 7 && dateMonth <= 12);
          });
        }
      }

      res.status(200).json({ success: true, data: filteredInvoices });
    } catch (error) {
      console.error('Download invoices error:', error);
      res.status(500).json({ success: false, message: 'Internal server error fetching invoices' });
    }
  }
}
