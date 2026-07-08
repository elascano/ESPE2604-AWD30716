import { Router } from 'express';
import { AtsController } from '../controllers/ats.controller';

const router = Router();
const atsController = new AtsController();

router.get('/user/:userId', (req, res) => atsController.getUserAts(req, res));
router.post('/user/:userId', (req, res) => atsController.saveAts(req, res));
router.get('/user/:userId/export-csv', (req, res) => atsController.exportInvoices(req, res));
router.post('/user/:userId/validate-csv', (req, res) => atsController.validateCsv(req, res));
router.post('/user/:userId/convert-xml', (req, res) => atsController.convertToXml(req, res));

export default router;
