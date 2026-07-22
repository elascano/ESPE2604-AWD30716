import { Router } from 'express';
import { prisma } from '../config/database';

const router = Router();

// GET /repo/audit/:userId — audit events for a user
router.get('/:userId', async (req, res) => {
  try {
    const events = await prisma.auditEvent.findMany({
      where: { taxpayerId: req.params.userId },
      orderBy: { timestamp: 'desc' },
      take: 100
    });
    res.json({ success: true, data: events });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// GET /repo/audit/all/logs — all audit events (for admin)
router.get('/all/logs', async (req, res) => {
  try {
    const logs = await prisma.auditEvent.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100,
      include: { taxpayer: { select: { email: true, ruc: true } } }
    });
    res.json({ success: true, data: logs });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// GET /repo/audit/action/:userId/:action — events by action (e.g. SRI_CONNECT)
router.get('/action/:userId/:action', async (req, res) => {
  try {
    const event = await prisma.auditEvent.findFirst({
      where: { taxpayerId: req.params.userId, action: req.params.action },
      orderBy: { timestamp: 'desc' }
    });
    res.json({ success: true, data: event });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// GET /repo/audit/module/:userId/:module — events by module (e.g. 'Integración SRI')
router.get('/module/:userId/:module', async (req, res) => {
  try {
    const events = await prisma.auditEvent.findMany({
      where: { taxpayerId: req.params.userId, module: { contains: req.params.module } },
      orderBy: { timestamp: 'desc' }
    });
    res.json({ success: true, data: events });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// POST /repo/audit — log an audit event
router.post('/', async (req, res) => {
  try {
    const { action, module, details, userId } = req.body;
    const event = await prisma.auditEvent.create({
      data: { action, module, details, taxpayerId: userId }
    });
    res.status(201).json({ success: true, data: event });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

export default router;
