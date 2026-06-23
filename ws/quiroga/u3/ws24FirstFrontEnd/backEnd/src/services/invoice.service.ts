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
    const result = await prisma.invoice.aggregate({
      where: { userId },
      _count: { id: true },
      _sum: { total: true },
    });

    return {
      count: result._count.id,
      totalAmount: result._sum.total || 0,
    };
  }
}
