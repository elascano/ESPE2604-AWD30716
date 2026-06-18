import { Router } from 'express';
import { createSoundmixer } from '../controllers/soundmixerBusinessController';

const router = Router();

router.post('/', createSoundmixer);

export default router;
