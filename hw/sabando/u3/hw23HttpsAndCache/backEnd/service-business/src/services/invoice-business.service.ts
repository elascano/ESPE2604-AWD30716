/**
 * InvoiceBusinessService — Lógica de negocio para facturas.
 * Normalización de campos y cálculo de resúmenes financieros (sin acceso a BD).
 */
export class InvoiceBusinessService {
  /**
   * Normaliza los campos de una factura cruda a la estructura esperada por la BD.
   */
  public normalizeInvoice(data: any, userId: string): object {
    let parsedProducts: any[] = [];
    if (data.products) {
      try {
        parsedProducts = typeof data.products === 'string' ? JSON.parse(data.products) : data.products;
        if (!Array.isArray(parsedProducts)) parsedProducts = [];
      } catch (e) {
        console.error('Error parsing products JSON:', e);
      }
    }

    return {
      number: data.number || '',
      authorizationNumber: data.authorizationNumber || '',
      accessKey: data.accessKey || '',
      emissionType: data.emissionType || 'Normal',
      issuerName: data.issuerName || '',
      issuerCommercialName: data.issuerCommercialName || data.issuerTradeName || '',
      issuerRuc: data.issuerRuc || '',
      issuerAddress: data.issuerAddress || '',
      customerName: data.customerName || data.clientName || '',
      customerId: data.customerId || data.clientIdentification || '',
      customerDate: data.customerDate || data.date || '',
      customerAddress: data.customerAddress || data.clientAddress || '',
      customerPhone: data.customerPhone || data.clientPhone || '',
      customerEmail: data.customerEmail || data.clientEmail || '',
      subtotal: Number(data.subtotal) || Number(data.taxBase) || 0,
      iva: Number(data.iva) || 0,
      total: Number(data.total) || 0,
      products: parsedProducts,
      type: data.type || 'COMPRA',
      format: data.format || 'XML',
      taxpayerId: userId,
      workspaceId: data.workspaceId || null,
    };
  }

  /**
   * Calcula el resumen financiero (ventas/compras/global) a partir de una lista de facturas.
   */
  public calculateSummary(invoices: any[]): object {
    let salesCount = 0, salesSubtotal = 0, salesIva = 0, salesTotal = 0;
    let expensesCount = 0, expensesSubtotal = 0, expensesIva = 0, expensesTotal = 0;

    invoices.forEach(inv => {
      const type = (inv.type || 'COMPRA').toUpperCase();
      const subtotal = inv.subtotal || 0;
      const iva = inv.iva || 0;
      const total = inv.total || 0;

      if (type === 'VENTA') {
        salesCount++; salesSubtotal += subtotal; salesIva += iva; salesTotal += total;
      } else {
        expensesCount++; expensesSubtotal += subtotal; expensesIva += iva; expensesTotal += total;
      }
    });

    return {
      sales: {
        count: salesCount,
        subtotal: Number(salesSubtotal.toFixed(2)),
        iva: Number(salesIva.toFixed(2)),
        total: Number(salesTotal.toFixed(2))
      },
      expenses: {
        count: expensesCount,
        subtotal: Number(expensesSubtotal.toFixed(2)),
        iva: Number(expensesIva.toFixed(2)),
        total: Number(expensesTotal.toFixed(2))
      },
      global: {
        count: invoices.length,
        subtotal: Number((salesSubtotal + expensesSubtotal).toFixed(2)),
        iva: Number((salesIva + expensesIva).toFixed(2)),
        total: Number((salesTotal + expensesTotal).toFixed(2))
      }
    };
  }
}
