import { Router } from 'express';
import {
  getPaymentHistory,
  getPaymentById,
  getPaymentsByPatient
} from '../controllers/paymentsBusinessController';

const router = Router();

router.get('/', getPaymentHistory);
router.get('/:paymentId', getPaymentById);
router.get('/patients/:patientId', getPaymentsByPatient);

export default router;