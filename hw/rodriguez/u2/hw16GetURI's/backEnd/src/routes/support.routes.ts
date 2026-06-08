import { Router } from 'express';
import { SupportController } from '../controllers/support.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const supportController = new SupportController();

router.use(authMiddleware);

router.post('/tickets', (req, res) => supportController.createTicket(req, res));
router.get('/tickets', (req, res) => supportController.getUserTickets(req, res));

export default router;
