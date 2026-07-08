import { prisma } from '../config/database';

export class TraceabilityService {
  public async getAuditEvents() {
    return prisma.auditEvent.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100,
      include: {
        user: {
          select: { firstName: true, lastName: true, ruc: true },
        },
      },
    });
  }

  public async logEvent(data: any) {
    return prisma.auditEvent.create({
      data: {
        action: data.action,
        module: data.module,
        details: data.details,
        userId: data.userId,
      },
    });
  }

  public async getProcessSteps(userId: string) {
    return prisma.processStep.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  public async updateProcessStep(stepId: string, status: string, completedAt?: Date) {
    return prisma.processStep.update({
      where: { id: stepId },
      data: { status, completedAt },
    });
  }
}
