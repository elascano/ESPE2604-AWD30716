import { Router } from 'express';
import { prisma } from '../config/database';

const router = Router();

// GET /repo/process-steps/:userId — process steps for a user
router.get('/:userId', async (req, res) => {
  try {
    const steps = await prisma.processStep.findMany({
      where: { taxpayerId: req.params.userId },
      orderBy: { createdAt: 'asc' }
    });
    res.json({ success: true, data: steps });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// PUT /repo/process-steps/:id — update step status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const completedAt = status === 'completed' ? new Date() : undefined;
    const step = await prisma.processStep.update({
      where: { id: req.params.id },
      data: { status, completedAt }
    });
    res.json({ success: true, data: step });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

export default router;
