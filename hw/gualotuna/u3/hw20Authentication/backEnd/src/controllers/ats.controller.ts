import { Request, Response } from 'express';
import { AtsService } from '../services/ats.service';
import { InvoiceService } from '../services/invoice.service';
import CircuitBreaker from 'opossum';

// URL del Servicio A (Reglas de Negocio)
const SERVICE_A_URL = process.env.SERVICE_A_URL || 'http://localhost:3001';

// Configuración del disyuntor
const breakerOptions = {
  timeout: 3000,               // Falla si el Servicio A tarda más de 3 segundos
  errorThresholdPercentage: 50, // Abre el circuito si el 50% de peticiones falla
  resetTimeout: 10000          // Tiempo de enfriamiento antes de reintentar (10s)
};

// Acciones que realiza el Servicio B hacia el Servicio A
async function generateCsvAction(invoices: any[]): Promise<string> {
  const response = await fetch(`${SERVICE_A_URL}/business/generate-csv`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ invoices })
  });
  if (!response.ok) {
    throw new Error(`Servicio A respondió con código ${response.status}`);
  }
  const result: any = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'Error en Servicio A');
  }
  return result.csvContent;
}

async function validateCsvAction(csvContent: string): Promise<any> {
  const response = await fetch(`${SERVICE_A_URL}/business/validate-csv`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ csvContent })
  });
  if (!response.ok) {
    throw new Error(`Servicio A respondió con código ${response.status}`);
  }
  const result: any = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'Error en Servicio A');
  }
  return result.data;
}

async function convertXmlAction(csvContent: string): Promise<string> {
  const response = await fetch(`${SERVICE_A_URL}/business/convert-xml`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ csvContent })
  });
  if (!response.ok) {
    throw new Error(`Servicio A respondió con código ${response.status}`);
  }
  const result: any = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'Error en Servicio A');
  }
  return result.xmlContent;
}

// Inicialización de disyuntores
const generateCsvBreaker = new CircuitBreaker(generateCsvAction, breakerOptions);
const validateCsvBreaker = new CircuitBreaker(validateCsvAction, breakerOptions);
const convertXmlBreaker = new CircuitBreaker(convertXmlAction, breakerOptions);

// Función de Fallback unificada
function handleFallback(error: any) {
  return {
    isFallback: true,
    message: 'El Servicio de Reglas de Negocio (Servicio A) no está disponible temporalmente. Las funciones básicas de CRUD (Servicio B) siguen operativas.',
    error: error.message || 'SERVICE_A_UNAVAILABLE'
  };
}

generateCsvBreaker.fallback(handleFallback);
validateCsvBreaker.fallback(handleFallback);
convertXmlBreaker.fallback(handleFallback);

export class AtsController {
  private atsService: AtsService;
  private invoiceService: InvoiceService;

  constructor() {
    this.atsService = new AtsService();
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
      
      const csvContent = await generateCsvBreaker.fire(invoices);
      
      if (typeof csvContent === 'object' && (csvContent as any).isFallback) {
        res.status(503).json(csvContent);
        return;
      }
      
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

      const result = await validateCsvBreaker.fire(csvContent);
      
      if (result && result.isFallback) {
        res.status(503).json(result);
        return;
      }

      res.status(200).json({
        success: true,
        data: result
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

      const xmlContent = await convertXmlBreaker.fire(csvContent);
      
      if (typeof xmlContent === 'object' && (xmlContent as any).isFallback) {
        res.status(503).json(xmlContent);
        return;
      }

      res.setHeader('Content-Type', 'application/xml');
      res.status(200).send(xmlContent);
    } catch (error) {
      console.error('Convert XML error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
