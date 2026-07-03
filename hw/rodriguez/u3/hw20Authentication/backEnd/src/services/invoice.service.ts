import { prisma } from '../config/database';

export class InvoiceService {
  public async getInvoicesByUser(userId: string) {
    return prisma.invoice.findMany({
      where: { userId },
      orderBy: { customerDate: 'desc' },
    });
  }

  public async saveInvoices(userId: string, invoicesData: any[]) {
    const invoices = invoicesData.map(data => {
      let parsedProducts: any[] = [];
      if (data.products) {
        try {
          parsedProducts = typeof data.products === 'string' ? JSON.parse(data.products) : data.products;
          if (!Array.isArray(parsedProducts)) {
            parsedProducts = [];
          }
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
        userId,
        workspaceId: data.workspaceId || null,
      };
    });

    await prisma.invoice.createMany({
      data: invoices,
      skipDuplicates: true,
    });

    return this.getInvoicesByUser(userId);
  }

  public async getInvoiceSummary(userId: string) {
    const invoices = await prisma.invoice.findMany({
      where: { userId }
    });

    let salesCount = 0;
    let salesSubtotal = 0;
    let salesIva = 0;
    let salesTotal = 0;

    let expensesCount = 0;
    let expensesSubtotal = 0;
    let expensesIva = 0;
    let expensesTotal = 0;

    invoices.forEach(inv => {
      const type = (inv.type || 'COMPRA').toUpperCase();
      const subtotal = inv.subtotal || 0;
      const iva = inv.iva || 0;
      const total = inv.total || 0;

      if (type === 'VENTA') {
        salesCount++;
        salesSubtotal += subtotal;
        salesIva += iva;
        salesTotal += total;
      } else {
        expensesCount++;
        expensesSubtotal += subtotal;
        expensesIva += iva;
        expensesTotal += total;
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
