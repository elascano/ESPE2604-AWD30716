import { Router } from 'express';
import { prisma } from '../config/database';

const router = Router();

// GET /repo/sri/status/:userId — last SRI_CONNECT event within 24h
router.get('/status/:userId', async (req, res) => {
  try {
    const lastConnect = await prisma.auditEvent.findFirst({
      where: { taxpayerId: req.params.userId, action: 'SRI_CONNECT' },
      orderBy: { timestamp: 'desc' }
    });
    res.json({ success: true, data: lastConnect });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// GET /repo/sri/history/:userId — SRI connection history
router.get('/history/:userId', async (req, res) => {
  try {
    const history = await prisma.auditEvent.findMany({
      where: { taxpayerId: req.params.userId, module: { contains: 'SRI' } },
      orderBy: { timestamp: 'desc' }
    });
    res.json({ success: true, data: history });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// POST /repo/sri/connect — log SRI connection event
router.post('/connect', async (req, res) => {
  try {
    const { userId, connected } = req.body;
    const event = await prisma.auditEvent.create({
      data: {
        action: connected ? 'SRI_CONNECT' : 'SRI_DISCONNECT',
        module: 'Integración SRI',
        details: connected ? 'Vinculación exitosa con portal SRI en línea' : 'Sesión con SRI finalizada',
        taxpayerId: userId
      }
    });
    res.status(201).json({ success: true, data: event });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

export default router;
