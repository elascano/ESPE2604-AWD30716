import { Router } from 'express';
import { InvoiceController } from '../controllers/invoice.controller';

const router = Router();
const invoiceController = new InvoiceController();

router.get('/user/:userId', (req, res) => invoiceController.getUserInvoices(req, res));
router.get('/download/:ruc', (req, res) => invoiceController.downloadInvoices(req, res));
router.post('/user/:userId', (req, res) => invoiceController.uploadInvoices(req, res));
router.get('/user/:userId/summary', (req, res) => invoiceController.getSummary(req, res));

export default router;
