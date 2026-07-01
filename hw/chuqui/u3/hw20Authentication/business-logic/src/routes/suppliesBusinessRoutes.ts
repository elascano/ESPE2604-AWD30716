import { Router } from 'express';
import { checkRole } from '../middleware/checkRole';
import { 
  updateExpirationStatus, 
  getAssetValuation, 
  getRestockProvisions, 
  getExpirationLosses, 
  getCapitalRisks 
} from '../controllers/suppliesBusinessController';

const router = Router();

router.post('/status-calculations', checkRole(['Administrator']), updateExpirationStatus);
router.get('/asset-valuations', checkRole(['Administrator']), getAssetValuation);
router.get('/restock-provisions', checkRole(['Administrator']), getRestockProvisions);
router.get('/expiration-losses', checkRole(['Administrator']), getExpirationLosses);
router.get('/capital-risks', checkRole(['Administrator']), getCapitalRisks);

export default router;