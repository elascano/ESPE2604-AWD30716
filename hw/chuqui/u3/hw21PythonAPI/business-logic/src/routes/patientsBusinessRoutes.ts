import { Router } from 'express';
import { checkRole } from '../middleware/checkRole';
import { 
  calculatePatientPediatricCategory,
  validateLegalRepresentative,
  calculateDaysToBirthday,
  calculateSeniorDiscount,
  estimateConsultationTime,
  calculateContactPriority
} from '../controllers/patientsBusinessController';

const router = Router();

router.post('/pediatric-category', checkRole(['Dentist']), calculatePatientPediatricCategory);
router.post('/legal-representative-validation', checkRole(['Dentist']), validateLegalRepresentative);
router.post('/days-to-birthday', checkRole(['Dentist']), calculateDaysToBirthday);
router.post('/senior-discount', checkRole(['Receptionist']), calculateSeniorDiscount);
router.post('/consultation-time-estimation', checkRole(['Dentist']), estimateConsultationTime);
router.post('/contact-priority', checkRole(['Receptionist']), calculateContactPriority);

export default router;