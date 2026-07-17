import { Request, Response } from 'express';
import { crudClient } from '../http-client/crud.client';
import { AtsBusinessService } from '../services/ats-business.service';
import { XmlService } from '../services/xml.service';

export class AtsController {
  private atsBusinessService = new AtsBusinessService();
  private xmlService = new XmlService();

  public async getUserAts(req: Request, res: Response): Promise<void> {
    try {
      const result = await crudClient.get(`/repo/ats/${req.params.userId}`);
      res.status(200).json(result);
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async saveAts(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const result = await crudClient.post('/repo/ats', { ...req.body, userId });
      res.status(201).json(result);
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async exportInvoices(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      // 1. Fetch invoices from Servicio B
      const invoicesResult = await crudClient.get(`/repo/invoices/${userId}`);
      const invoices = invoicesResult.data || [];

      // 2. Business logic: generate CSV from invoices (pure function, no DB)
      const csvContent = this.atsBusinessService.generateInvoiceCsv(invoices);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=invoices_${userId}.csv`);
      res.status(200).send(csvContent);
    } catch (error) {
      console.error('Export CSV error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async validateCsv(req: Request, res: Response): Promise<void> {
    try {
      const { csvContent } = req.body;
      if (!csvContent || typeof csvContent !== 'string') {
        res.status(400).json({ success: false, message: 'csvContent is required as string' }); return;
      }

      // Business logic: validate CSV structure and totals (pure function)
      const rows = this.xmlService.parseCsv(csvContent);
      if (rows.length === 0) { res.status(400).json({ success: false, message: 'CSV is empty' }); return; }

      const headers = rows[0].map((h: string) => h.replace(/^"|"$/g, '').trim());
      const invoices = rows.slice(1).map(row => {
        const inv: any = {};
        headers.forEach((h: string, i: number) => { inv[h] = row[i] || ''; });
        return inv;
      });

      const errors: string[] = [];
      let totalSalesSubtotal = 0, totalSalesIva = 0, totalSalesAmount = 0;
      let totalExpensesSubtotal = 0, totalExpensesIva = 0, totalExpensesAmount = 0;

      invoices.forEach((inv, index) => {
        const rowNum = index + 2;
        const type = (inv.type || 'COMPRA').toUpperCase();
        const subtotal = parseFloat(inv.subtotal) || 0;
        const iva = parseFloat(inv.iva) || 0;
        const total = parseFloat(inv.total) || 0;

        if (!inv.number) errors.push(`Fila ${rowNum}: Falta el número de factura.`);
        if (!inv.issuerRuc) errors.push(`Fila ${rowNum}: Falta el RUC del emisor.`);
        if (Math.abs((subtotal + iva) - total) > 0.05) errors.push(`Fila ${rowNum}: Subtotal + IVA no coincide con total.`);

        if (type === 'VENTA') { totalSalesSubtotal += subtotal; totalSalesIva += iva; totalSalesAmount += total; }
        else { totalExpensesSubtotal += subtotal; totalExpensesIva += iva; totalExpensesAmount += total; }
      });

      res.status(200).json({ success: true, data: { isValid: errors.length === 0, invoiceCount: invoices.length,
        totals: {
          sales: { subtotal: +totalSalesSubtotal.toFixed(2), iva: +totalSalesIva.toFixed(2), total: +totalSalesAmount.toFixed(2) },
          expenses: { subtotal: +totalExpensesSubtotal.toFixed(2), iva: +totalExpensesIva.toFixed(2), total: +totalExpensesAmount.toFixed(2) }
        }, errors }
      });
    } catch (error) {
      console.error('Validate CSV error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async convertToXml(req: Request, res: Response): Promise<void> {
    try {
      const { csvContent } = req.body;
      if (!csvContent || typeof csvContent !== 'string') {
        res.status(400).json({ success: false, message: 'csvContent is required as string' }); return;
      }
      // Business logic: convert CSV to XML (pure function)
      const xmlContent = this.xmlService.convertCsvToXml(csvContent);
      res.setHeader('Content-Type', 'application/xml');
      res.status(200).send(xmlContent);
    } catch (error) {
      console.error('Convert XML error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
