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
}
