import { Router } from 'express';
import { checkRole } from '../middleware/checkRole';
import {
  getPaymentHistory,
  getPaymentById,
  getPaymentsByPatient
} from '../controllers/paymentsBusinessController';

const router = Router();

router.get('/', checkRole(['Receptionist']), getPaymentHistory);
router.get('/:paymentId', checkRole(['Receptionist']), getPaymentById);
router.get('/patients/:patientId', checkRole(['Receptionist']), getPaymentsByPatient);

export default router;