import { Router } from 'express';
import { prisma } from '../config/database';

const router = Router();

// GET /repo/invoices/:userId — list invoices for a user
router.get('/:userId', async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { taxpayerId: req.params.userId },
      orderBy: { customerDate: 'desc' }
    });
    res.json({ success: true, data: invoices });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// GET /repo/invoices/filter/by — filter invoices by RUC and period
router.get('/filter/by', async (req, res) => {
  try {
    const { ruc, year, periodType, month, semester } = req.query;
    if (!ruc) { res.status(400).json({ success: false, message: 'RUC is required' }); return; }

    let invoices = await prisma.invoice.findMany({ where: { customerId: ruc as string } });

    if (year) {
      if (periodType === 'monthly' && month) {
        const m = String(month).padStart(2, '0');
        const prefix = `${year}-${m}-`;
        invoices = invoices.filter(inv => inv.customerDate.startsWith(prefix));
      } else if (periodType === 'semi-annual' && semester) {
        const isFirstSem = String(semester) === '1';
        invoices = invoices.filter(inv => {
          const dateYear = inv.customerDate.substring(0, 4);
          const dateMonth = parseInt(inv.customerDate.substring(5, 7));
          if (dateYear !== String(year)) return false;
          return isFirstSem ? (dateMonth >= 1 && dateMonth <= 6) : (dateMonth >= 7 && dateMonth <= 12);
        });
      }
    }

    res.json({ success: true, data: invoices });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// GET /repo/invoices/count/:userId — count invoices for dashboard
router.get('/count/:userId', async (req, res) => {
  try {
    const count = await prisma.invoice.count({ where: { taxpayerId: req.params.userId } });
    res.json({ success: true, data: { count } });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

// POST /repo/invoices — bulk save invoices
router.post('/', async (req, res) => {
  try {
    const { userId, invoices } = req.body;
    await prisma.invoice.createMany({ data: invoices.map((inv: any) => ({ ...inv, taxpayerId: userId })), skipDuplicates: true });
    const saved = await prisma.invoice.findMany({ where: { taxpayerId: userId }, orderBy: { customerDate: 'desc' } });
    res.status(201).json({ success: true, data: saved });
  } catch (e) { res.status(500).json({ success: false, message: 'Internal server error' }); }
});

export default router;
