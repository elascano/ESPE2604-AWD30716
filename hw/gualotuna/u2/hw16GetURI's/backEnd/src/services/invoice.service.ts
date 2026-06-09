import { prisma } from '../config/database';

export class InvoiceService {
  public async getInvoicesByUser(userId: string) {
    return prisma.invoice.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  public async saveInvoices(userId: string, invoicesData: any[]) {
    const invoices = invoicesData.map(data => ({
      number: data.number || '',
      issuerName: data.issuerName || '',
      issuerRuc: data.issuerRuc || '',
      date: data.date || '',
      taxBase: Number(data.taxBase) || 0,
      iva: Number(data.iva) || 0,
      total: Number(data.total) || 0,
      format: data.format || 'XML',
      userId,
    }));

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
