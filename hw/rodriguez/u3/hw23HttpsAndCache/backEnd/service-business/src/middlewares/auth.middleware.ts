import { Request, Response, NextFunction } from 'express';
import { crudClient } from '../http-client/crud.client';
import jwt from 'jsonwebtoken';

/**
 * Middleware de autenticación JWT.
 * Verifica el token y consulta al Servicio B (service-crud) para validar que el usuario existe.
 * El token JWT nunca llega al Servicio B — solo se verifica aquí.
 */
export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Missing or invalid authentication header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (err) {
      res.status(401).json({ success: false, message: 'Invalid or expired token' });
      return;
    }

    const userId = decoded.id;

    // Consulta al Servicio B si el usuario existe
    const result = await crudClient.get(`/repo/users/${userId}`);
    if (!result.success || !result.data) {
      res.status(401).json({ success: false, message: 'Invalid user' });
      return;
    }

    // Adjunta el usuario al request para uso en controllers
    (req as any).currentUser = result.data;
    next();
  } catch (error) {
    console.error('[authMiddleware] Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
