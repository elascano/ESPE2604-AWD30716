import { Request, Response, NextFunction } from 'express';

/**
 * Middleware que valida que la petición proviene del Servicio A (service-business).
 * Verifica el header x-internal-api-key contra la variable de entorno INTERNAL_API_KEY.
 * El JWT del usuario final NO llega hasta aquí — solo se verifica en service-business.
 */
export function apiKeyMiddleware(req: Request, res: Response, next: NextFunction): void {
  const key = req.headers['x-internal-api-key'];

  if (!key || key !== process.env.INTERNAL_API_KEY) {
    res.status(403).json({ success: false, message: 'Forbidden: invalid or missing API key' });
    return;
  }

  next();
}
