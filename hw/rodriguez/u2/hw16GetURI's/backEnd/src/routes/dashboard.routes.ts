import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

const router = Router();
const dashboardController = new DashboardController();

router.get('/:userId', (req, res) => dashboardController.getSummary(req, res));

export default router;
