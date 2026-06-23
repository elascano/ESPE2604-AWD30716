import { Request, Response } from 'express';
import { AtsService } from '../services/ats.service';
import { XmlService } from '../services/xml.service';
import { InvoiceService } from '../services/invoice.service';

export class AtsController {
  private atsService: AtsService;
  private xmlService: XmlService;
  private invoiceService: InvoiceService;

  constructor() {
    this.atsService = new AtsService();
    this.xmlService = new XmlService();
    this.invoiceService = new InvoiceService();
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

  public async exportInvoices(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const invoices = await this.invoiceService.getInvoicesByUser(userId as string);
      const csvContent = this.atsService.generateInvoiceCsv(invoices);
      
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
        res.status(400).json({ success: false, message: 'csvContent is required as string' });
        return;
      }

      const rows = this.xmlService.parseCsv(csvContent);
      if (rows.length === 0) {
        res.status(400).json({ success: false, message: 'CSV content is empty' });
        return;
      }

      const headers = rows[0].map(h => h.replace(/^"|"$/g, '').trim());
      const invoices: any[] = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const invoice: any = {};
        headers.forEach((header, index) => {
          let cellVal = row[index] || '';
          if (cellVal.startsWith('"') && cellVal.endsWith('"')) {
            cellVal = cellVal.substring(1, cellVal.length - 1);
          }
          invoice[header] = cellVal;
        });
        invoices.push(invoice);
      }

      let totalSalesSubtotal = 0;
      let totalSalesIva = 0;
      let totalSalesAmount = 0;

      let totalExpensesSubtotal = 0;
      let totalExpensesIva = 0;
      let totalExpensesAmount = 0;

      const invoiceCount = invoices.length;
      const validationErrors: string[] = [];

      invoices.forEach((inv, index) => {
        const rowNum = index + 2; 
        const type = (inv.type || 'COMPRA').toUpperCase();
        const subtotalVal = parseFloat(inv.subtotal) || 0;
        const iva = parseFloat(inv.iva) || 0;
        const total = parseFloat(inv.total) || 0;

        if (!inv.number) {
          validationErrors.push(`Fila ${rowNum}: Falta el número de factura.`);
        }

        if (!inv.issuerRuc) {
          validationErrors.push(`Fila ${rowNum}: Falta el RUC del emisor.`);
        }

        const diff = Math.abs((subtotalVal + iva) - total);
        if (diff > 0.05) { 
          validationErrors.push(`Fila ${rowNum} (${inv.number || 'Sin número'}): La suma de subtotal (${subtotalVal}) + IVA (${iva}) no coincide con el total (${total}). Dif: ${diff.toFixed(2)}`);
        }

        if (type === 'VENTA') {
          totalSalesSubtotal += subtotalVal;
          totalSalesIva += iva;
          totalSalesAmount += total;
        } else if (type === 'COMPRA') {
          totalExpensesSubtotal += subtotalVal;
          totalExpensesIva += iva;
          totalExpensesAmount += total;
        } else {
          validationErrors.push(`Fila ${rowNum}: Tipo de factura desconocido '${type}'. Debe ser VENTA o COMPRA.`);
          totalExpensesSubtotal += subtotalVal;
          totalExpensesIva += iva;
          totalExpensesAmount += total;
        }
      });

      res.status(200).json({
        success: true,
        data: {
          isValid: validationErrors.length === 0,
          invoiceCount,
          totals: {
            sales: {
              subtotal: Number(totalSalesSubtotal.toFixed(2)),
              iva: Number(totalSalesIva.toFixed(2)),
              total: Number(totalSalesAmount.toFixed(2))
            },
            expenses: {
              subtotal: Number(totalExpensesSubtotal.toFixed(2)),
              iva: Number(totalExpensesIva.toFixed(2)),
              total: Number(totalExpensesAmount.toFixed(2))
            },
            global: {
              subtotal: Number((totalSalesSubtotal + totalExpensesSubtotal).toFixed(2)),
              iva: Number((totalSalesIva + totalExpensesIva).toFixed(2)),
              total: Number((totalSalesAmount + totalExpensesAmount).toFixed(2))
            }
          },
          errors: validationErrors
        }
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
        res.status(400).json({ success: false, message: 'csvContent is required as string' });
        return;
      }

      const xmlContent = this.xmlService.convertCsvToXml(csvContent);
      res.setHeader('Content-Type', 'application/xml');
      res.status(200).send(xmlContent);
    } catch (error) {
      console.error('Convert XML error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
