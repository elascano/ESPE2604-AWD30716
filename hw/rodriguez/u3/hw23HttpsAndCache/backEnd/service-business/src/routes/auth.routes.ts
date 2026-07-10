import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

router.post('/register',         (req, res) => authController.register(req, res));
router.post('/login',            (req, res) => authController.login(req, res));
router.post('/login/google',     (req, res) => authController.loginGoogle(req, res));
router.post('/complete-profile', (req, res) => authController.completeProfile(req, res));
router.post('/reset-password',   (req, res) => authController.resetPassword(req, res));

export default router;
