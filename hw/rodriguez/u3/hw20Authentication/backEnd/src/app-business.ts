import express, { Application } from 'express';
import cors from 'cors';
import { AtsService } from './services/ats.service';
import { XmlService } from './services/xml.service';

class AppBusiness {
  public app: Application;
  private atsService: AtsService;
  private xmlService: XmlService;

  constructor() {
    this.app = express();
    this.atsService = new AtsService();
    this.xmlService = new XmlService();
    this.configureMiddlewares();
    this.configureRoutes();
  }

  private configureMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
  }

  private configureRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK', service: 'Business Rules Service', timestamp: new Date() });
    });

    // 1. Generate CSV from invoices list
    this.app.post('/business/generate-csv', (req, res) => {
      try {
        const { invoices } = req.body;
        if (!invoices || !Array.isArray(invoices)) {
          res.status(400).json({ success: false, message: 'invoices array is required' });
          return;
        }
        const csvContent = this.atsService.generateInvoiceCsv(invoices);
        res.status(200).json({ success: true, csvContent });
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
      }
    });

    // 2. Validate CSV content
    this.app.post('/business/validate-csv', (req, res) => {
      try {
        const { csvContent } = req.body;
        if (!csvContent || typeof csvContent !== 'string') {
          res.status(400).json({ success: false, message: 'csvContent string is required' });
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
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
      }
    });

    // 3. Convert CSV to XML
    this.app.post('/business/convert-xml', (req, res) => {
      try {
        const { csvContent } = req.body;
        if (!csvContent || typeof csvContent !== 'string') {
          res.status(400).json({ success: false, message: 'csvContent string is required' });
          return;
        }
        const xmlContent = this.xmlService.convertCsvToXml(csvContent);
        res.status(200).json({ success: true, xmlContent });
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
      }
    });
  }
}

export default new AppBusiness().app;
