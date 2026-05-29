import { Router } from 'express';
import passport from 'passport';
import { handleGoogleCallback, checkSessionStatus, logoutUser } from '../controllers/authController';

const router = Router();

// 1. Initiates the Google login flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2. Google redirects here after successful login
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }), 
  handleGoogleCallback
);

// 3. Frontend checks this to see if the 1-minute session is still alive
router.get('/status', checkSessionStatus);

// 4. Handles logout
router.post('/logout', logoutUser);

export default router;