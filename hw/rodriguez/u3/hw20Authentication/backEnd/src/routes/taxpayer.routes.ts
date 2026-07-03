import { Router } from 'express';
import { TaxpayerController } from '../controllers/taxpayer.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const taxpayerController = new TaxpayerController();

router.get('/profile/:userId', (req, res) => taxpayerController.getProfile(req, res));
router.get('/stats/:userId', (req, res) => taxpayerController.getStats(req, res));
router.get('/validate-ruc/:ruc', (req, res) => taxpayerController.validateRuc(req, res));
router.put('/profile/:userId', (req, res) => taxpayerController.updateProfile(req, res));

export default router;
