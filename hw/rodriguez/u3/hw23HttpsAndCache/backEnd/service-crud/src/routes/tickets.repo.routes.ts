import { Router } from 'express';
import { prisma } from '../config/database';

const router = Router();

// GET /repo/tickets — all tickets (for admin)
router.get('/', async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
      include: { taxpayer: { select: { firstName: true, lastName: true, email: true } } }
    });
    res.json({ success: true, data: tickets });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// GET /repo/tickets/:userId — tickets for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { taxpayerId: req.params.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: tickets });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// POST /repo/tickets — create a support ticket
router.post('/', async (req, res) => {
  try {
    const { subject, category, priority, description, userId } = req.body;
    const ticket = await prisma.ticket.create({
      data: { subject, category, priority, description, taxpayerId: userId }
    });
    res.status(201).json({ success: true, data: ticket });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// PUT /repo/tickets/:id/status — update ticket status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await prisma.ticket.update({ where: { id: req.params.id }, data: { status } });
    res.json({ success: true, data: updated });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

export default router;
