import { prisma } from '../config/database';

export class AtsService {
  public async getAtsFilesByUser(userId: string) {
    return prisma.atsFile.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  public async saveAtsFile(data: any) {
    return prisma.atsFile.create({
      data: {
        name: data.name,
        format: data.format,
        periodMonth: data.periodMonth,
        periodYear: data.periodYear,
        invoiceCount: data.invoiceCount,
        validationErrors: data.validationErrors,
        userId: data.userId,
      },
    });
  }

  public generateInvoiceCsv(invoices: any[]): string {
    const headers = [
      'id', 'type', 'number', 'issuerName', 'issuerCommercialName', 'issuerAddress', 'issuerRuc',
      'customerDate', 'authorizationNumber', 'emissionType', 'accessKey', 'customerName', 'customerId',
      'customerAddress', 'customerPhone', 'customerEmail', 'subtotal', 'iva', 'total', 'products'
    ];

    const csvRows = [headers.join(',')];

    for (const invoice of invoices) {
      const values = headers.map(header => {
        let val = invoice[header];
        if (header === 'products' && val) {
          val = typeof val === 'string' ? val : JSON.stringify(val);
        }
        
        if (val === undefined || val === null) {
          return '';
        }
        
        const strVal = String(val);
        if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n') || strVal.includes('\r')) {
          const escaped = strVal.replace(/"/g, '""');
          return `"${escaped}"`;
        }
        
        return strVal;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }
}
