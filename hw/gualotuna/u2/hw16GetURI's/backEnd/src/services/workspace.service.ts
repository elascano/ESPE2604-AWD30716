import { prisma } from '../config/database';

export class WorkspaceService {
  public async getUserWorkspaces(userId: string) {
    return prisma.workspace.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  public async getWorkspaceById(id: string, userId?: string) {
    const whereClause: any = { id };
    if (userId) whereClause.userId = userId;
    return prisma.workspace.findFirst({
      where: whereClause
    });
  }

  public async getWorkspaceInvoices(workspaceId: string, userId?: string) {
    const whereClause: any = { workspaceId };
    if (userId) whereClause.userId = userId;
    return prisma.invoice.findMany({
      where: whereClause,
      orderBy: { date: 'desc' }
    });
  }

  public async getWorkspaceAtsFiles(workspaceId: string, userId?: string) {
    const whereClause: any = { workspaceId };
    if (userId) whereClause.userId = userId;
    return prisma.atsFile.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
  }

  public async getWorkspaceSummary(workspaceId: string, userId?: string) {
    const whereClause: any = { workspaceId };
    if (userId) whereClause.userId = userId;

    const aggregate = await prisma.invoice.aggregate({
      where: whereClause,
      _count: { id: true },
      _sum: { total: true, taxBase: true, iva: true }
    });

    const errorAtsCount = await prisma.atsFile.aggregate({
      where: whereClause,
      _sum: { validationErrors: true }
    });

    return {
      invoiceCount: aggregate._count.id,
      taxBaseSum: aggregate._sum.taxBase || 0,
      ivaSum: aggregate._sum.iva || 0,
      totalSum: aggregate._sum.total || 0,
      errorCount: errorAtsCount._sum.validationErrors || 0
    };
  }

  public async getWorkspaceProcessStatus(workspaceId: string, userId?: string) {
    const whereClause: any = { workspaceId };
    if (userId) whereClause.userId = userId;

    const steps = await prisma.processStep.findMany({
      where: whereClause
    });

    // Mapea a estados booleanos requeridos por la vista del frontend
    const invoiceDownloadStep = steps.find(s => s.title.toLowerCase().includes('descarg') || s.description.toLowerCase().includes('descarg'));
    const atsXlsmStep = steps.find(s => s.title.toLowerCase().includes('xlsm') || s.description.toLowerCase().includes('xlsm'));
    const atsXmlStep = steps.find(s => s.title.toLowerCase().includes('xml') || s.description.toLowerCase().includes('xml'));

    return {
      invoiceDownloadStatus: invoiceDownloadStep ? invoiceDownloadStep.status === 'completed' : false,
      atsXlsmGenerationStatus: atsXlsmStep ? atsXlsmStep.status === 'completed' : false,
      atsXmlGenerationStatus: atsXmlStep ? atsXmlStep.status === 'completed' : false
    };
  }

  public async getWorkspaceProcessSteps(workspaceId: string, userId?: string) {
    const whereClause: any = { workspaceId };
    if (userId) whereClause.userId = userId;

    return prisma.processStep.findMany({
      where: whereClause,
      orderBy: { createdAt: 'asc' }
    });
  }

  public async getWorkspaceLogs(workspaceId: string, userId?: string) {
    const whereClause: any = {
      OR: [
        { details: { contains: workspaceId } },
        { module: { contains: 'Workspace' } }
      ]
    };
    if (userId) whereClause.userId = userId;

    const events = await prisma.auditEvent.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: 50
    });
    return events;
  }
}
