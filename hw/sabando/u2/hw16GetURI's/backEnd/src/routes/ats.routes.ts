import { Router } from 'express';
import { AtsController } from '../controllers/ats.controller';

const router = Router();
const atsController = new AtsController();

router.get('/user/:userId', (req, res) => atsController.getUserAts(req, res));
router.post('/user/:userId', (req, res) => atsController.saveAts(req, res));

export default router;
