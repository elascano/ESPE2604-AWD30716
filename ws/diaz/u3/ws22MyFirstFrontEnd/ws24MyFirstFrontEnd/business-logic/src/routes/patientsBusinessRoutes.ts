import { Router } from 'express';
import { 
  calculatePatientPediatricCategory,
  validateLegalRepresentative,
  calculateDaysToBirthday,
  calculateSeniorDiscount,
  estimateConsultationTime,
  calculateContactPriority
} from '../controllers/patientsBusinessController';

const router = Router();

router.post('/pediatric-category', calculatePatientPediatricCategory);
router.post('/legal-representative-validation', validateLegalRepresentative);
router.post('/days-to-birthday', calculateDaysToBirthday);
router.post('/senior-discount', calculateSeniorDiscount);
router.post('/consultation-time-estimation', estimateConsultationTime);
router.post('/contact-priority', calculateContactPriority);

export default router;