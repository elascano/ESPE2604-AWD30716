import { Router } from 'express';
import { prisma } from '../config/database';

const router = Router();

// GET /repo/workspaces/:userId — list workspaces for a user
router.get('/:userId', async (req, res) => {
  try {
    const workspaces = await prisma.workspace.findMany({
      where: { taxpayerId: req.params.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: workspaces });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// GET /repo/workspaces/detail/:id — get single workspace (with ownership check)
router.get('/detail/:id', async (req, res) => {
  try {
    const { userId } = req.query;
    const workspace = await prisma.workspace.findFirst({
      where: { id: req.params.id, ...(userId ? { taxpayerId: userId as string } : {}) }
    });
    res.json({ success: true, data: workspace });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// GET /repo/workspaces/invoices/:id — invoices in a workspace
router.get('/invoices/:id', async (req, res) => {
  try {
    const { userId } = req.query;
    const invoices = await prisma.invoice.findMany({
      where: { workspaceId: req.params.id, ...(userId ? { taxpayerId: userId as string } : {}) }
    });
    res.json({ success: true, data: invoices });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// GET /repo/workspaces/ats-files/:id — ATS files in a workspace
router.get('/ats-files/:id', async (req, res) => {
  try {
    const { userId } = req.query;
    const atsFiles = await prisma.atsFile.findMany({
      where: { workspaceId: req.params.id, ...(userId ? { taxpayerId: userId as string } : {}) }
    });
    res.json({ success: true, data: atsFiles });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// GET /repo/workspaces/process-steps/:id — process steps for a workspace
router.get('/process-steps/:id', async (req, res) => {
  try {
    const { userId } = req.query;
    const steps = await prisma.processStep.findMany({
      where: { workspaceId: req.params.id, ...(userId ? { taxpayerId: userId as string } : {}) },
      orderBy: { createdAt: 'asc' }
    });
    res.json({ success: true, data: steps });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// GET /repo/workspaces/logs/:id — audit logs for a workspace
router.get('/logs/:id', async (req, res) => {
  try {
    const { userId } = req.query;
    const whereClause: any = {
      OR: [{ details: { contains: req.params.id } }, { module: { contains: 'Workspace' } }]
    };
    if (userId) whereClause.taxpayerId = userId;
    const events = await prisma.auditEvent.findMany({ where: whereClause, orderBy: { timestamp: 'desc' }, take: 50 });
    res.json({ success: true, data: events });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// POST /repo/workspaces — create workspace
router.post('/', async (req, res) => {
  try {
    const { name, description, period, workspaceLocation, userId } = req.body;
    
    // Fallbacks in case period is a simple string for legacy tests
    let periodYear = 2025;
    let periodMonth = null;
    let periodSemester = null;
    let periodType = 'monthly';

    if (period && typeof period === 'object') {
      periodYear = period.year;
      periodType = period.type || 'monthly';
      periodMonth = period.month || null;
      periodSemester = period.semester || null;
    } else if (period && typeof period === 'string') {
      periodYear = parseInt(period.split('-')[0]) || 2025;
      periodMonth = parseInt(period.split('-')[1]) || null;
    }

    const workspace = await prisma.workspace.create({
      data: {
        name: name || `Workspace ${periodYear}`,
        description: description || null,
        periodYear,
        periodMonth,
        periodType,
        periodSemester,
        workspaceLocation,
        taxpayerId: userId
      }
    });
    res.status(201).json({ success: true, data: workspace });
  } catch (e) {
    console.error('Error creating workspace:', e);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// DELETE /repo/workspaces/:id — delete workspace
router.delete('/:id', async (req, res) => {
  try {
    await prisma.workspace.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Workspace deleted successfully' });
  } catch (e) {
    console.error('Error deleting workspace:', e);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
