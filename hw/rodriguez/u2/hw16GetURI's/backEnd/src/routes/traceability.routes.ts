import { Router } from 'express';
import { TraceabilityController } from '../controllers/traceability.controller';

const router = Router();
const traceabilityController = new TraceabilityController();

router.get('/audit', (req, res) => traceabilityController.getAuditLog(req, res));
router.post('/audit', (req, res) => traceabilityController.logAction(req, res));

router.get('/process/:userId', (req, res) => traceabilityController.getUserProcessSteps(req, res));
router.put('/process/:stepId', (req, res) => traceabilityController.updateStep(req, res));

export default router;
