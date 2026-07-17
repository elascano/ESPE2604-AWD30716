import { Router } from 'express';
import { SriController } from '../controllers/sri.controller';

const router = Router();
const sriController = new SriController();

router.get('/status/:userId', (req, res) => sriController.getSriStatus(req, res));
router.get('/history/:userId', (req, res) => sriController.getSriHistory(req, res));
router.post('/connect', (req, res) => sriController.connect(req, res));

export default router;
