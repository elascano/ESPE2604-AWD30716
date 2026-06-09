import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req.headers['x-user-id'] as string) || req.headers['x-user-id'];
    if (!userId || typeof userId !== 'string') {
      res.status(401).json({ success: false, message: 'Missing authentication header' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid user' });
      return;
    }

    // attach user to request for convenience
    (req as any).currentUser = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
