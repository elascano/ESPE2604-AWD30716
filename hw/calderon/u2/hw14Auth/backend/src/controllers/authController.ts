import { Request, Response } from 'express';

export const handleGoogleCallback = (req: Request, res: Response) => {
  const baseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:5173';
  
  const redirectUrl = baseUrl.replace(/\/$/, '') + '/home';
  
  // Successful authentication, redirect to the Vue frontend home
  res.redirect(redirectUrl);
};

export const checkSessionStatus = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ isAuthenticated: true, user: req.user });
  }
  return res.status(401).json({ isAuthenticated: false });
};

export const logoutUser = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
};