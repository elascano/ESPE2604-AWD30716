import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const tokenBlacklist = new Set<string>();

export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. Token required.' });
    }

    const token = authHeader.split(' ')[1];

    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ error: 'Invalid session. Please log in again.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        username: string;
        role: string;
      };

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Forbidden. You do not have the required permissions.' });
      }

      next();
    } catch {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }
  };
};
