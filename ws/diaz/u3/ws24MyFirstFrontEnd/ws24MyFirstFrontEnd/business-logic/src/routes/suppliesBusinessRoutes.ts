import { Router } from 'express';
import { 
  updateExpirationStatus, 
  getAssetValuation, 
  getRestockProvisions, 
  getExpirationLosses, 
  getCapitalRisks 
} from '../controllers/suppliesBusinessController';

const router = Router();

router.post('/status-calculations', updateExpirationStatus);
router.get('/asset-valuations', getAssetValuation);
router.get('/restock-provisions', getRestockProvisions);
router.get('/expiration-losses', getExpirationLosses);
router.get('/capital-risks', getCapitalRisks);

export default router;