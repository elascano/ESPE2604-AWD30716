/**
 * AtsBusinessService — Lógica de negocio para el módulo ATS.
 * Solo operaciones puras (sin acceso a BD).
 */
export class AtsBusinessService {
  /**
   * Convierte una lista de facturas en formato CSV compatible con el SRI.
   */
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
        if (val === undefined || val === null) return '';
        const strVal = String(val);
        if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n') || strVal.includes('\r')) {
          return `"${strVal.replace(/"/g, '""')}"`;
        }
        return strVal;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }
}
