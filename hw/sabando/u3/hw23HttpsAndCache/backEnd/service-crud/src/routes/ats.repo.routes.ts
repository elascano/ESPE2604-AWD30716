import { Router } from 'express';
import { prisma } from '../config/database';

const router = Router();

// GET /repo/ats/:userId — list ATS files for a user
router.get('/:userId', async (req, res) => {
  try {
    const files = await prisma.atsFile.findMany({
      where: { taxpayerId: req.params.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: files });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// GET /repo/ats/errors/count/:userId — count ATS files with errors (for dashboard)
router.get('/errors/count/:userId', async (req, res) => {
  try {
    const count = await prisma.atsFile.count({
      where: { taxpayerId: req.params.userId, validationErrors: { gt: 0 } }
    });
    res.json({ success: true, data: { count } });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// POST /repo/ats — save an ATS file record
router.post('/', async (req, res) => {
  try {
    const { name, format, periodMonth, periodYear, invoiceCount, validationErrors, userId } = req.body;
    const atsFile = await prisma.atsFile.create({
      data: { name, format, periodMonth, periodYear, invoiceCount, validationErrors, taxpayerId: userId }
    });
    res.status(201).json({ success: true, data: atsFile });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

export default router;
