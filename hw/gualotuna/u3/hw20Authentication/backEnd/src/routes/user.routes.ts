import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

router.get('/', authMiddleware, (req, res) => userController.getUsers(req, res));
router.get('/:id', authMiddleware, (req, res) => userController.getUser(req, res));
router.post('/register', (req, res) => userController.register(req, res));
router.post('/login', (req, res) => userController.login(req, res));
router.post('/login/google', (req, res) => userController.loginGoogle(req, res));
router.post('/complete-profile', (req, res) => userController.completeProfile(req, res));
router.post('/reset-password', (req, res) => userController.resetPassword(req, res));

export default router;
