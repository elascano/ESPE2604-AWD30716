import { Router } from 'express';
import { prisma } from '../config/database';

const router = Router();

// GET /repo/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.taxpayer.findUnique({ where: { id: req.params.id } });
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
    res.json({ success: true, data: user });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// GET /repo/users/ruc/:ruc
router.get('/ruc/:ruc', async (req, res) => {
  try {
    const user = await prisma.taxpayer.findUnique({ where: { ruc: req.params.ruc } });
    res.json({ success: true, data: user });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// GET /repo/users — list all (for admin)
router.get('/', async (req, res) => {
  try {
    const users = await prisma.taxpayer.findMany({
      select: { id: true, ruc: true, firstName: true, lastName: true, email: true, role: true, createdAt: true }
    });
    res.json({ success: true, data: users });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// POST /repo/users/find — find by email or ruc (login lookup)
router.post('/find', async (req, res) => {
  try {
    const { identifier } = req.body;
    const user = await prisma.taxpayer.findFirst({
      where: { OR: [{ email: identifier }, { ruc: identifier }] }
    });
    res.json({ success: true, data: user });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// POST /repo/users — create user
router.post('/', async (req, res) => {
  try {
    const user = await prisma.taxpayer.create({ data: req.body });
    res.status(201).json({ success: true, data: user });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// PUT /repo/users/:id — update user profile
router.put('/:id', async (req, res) => {
  try {
    const updated = await prisma.taxpayer.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: updated });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// PUT /repo/users/:id/password — update password
router.put('/:id/password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    await prisma.taxpayer.update({ where: { email }, data: { password: newPassword } });
    res.json({ success: true, message: 'Password updated' });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// DELETE /repo/users/:id — delete user + cascade
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await prisma.$transaction([
      prisma.invoice.deleteMany({ where: { taxpayerId: userId } }),
      prisma.atsFile.deleteMany({ where: { taxpayerId: userId } }),
      prisma.processStep.deleteMany({ where: { taxpayerId: userId } }),
      prisma.auditEvent.deleteMany({ where: { taxpayerId: userId } }),
      prisma.ticket.deleteMany({ where: { taxpayerId: userId } }),
      prisma.workspace.deleteMany({ where: { taxpayerId: userId } }),
      prisma.taxpayer.delete({ where: { id: userId } })
    ]);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (e) {
    console.error('Error deleting user:', e);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
