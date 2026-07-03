import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'ser-salud-secret-key';

const PHYSIOTHERAPIST = {
  id: 'physiotherapist',
  password: 'physiotherapist123',
  name: 'Physiotherapist',
  role: 'physiotherapist'
};

router.post('/api/auth/login', (req: Request, res: Response) => {
  const { id, password } = req.body;

  if (!id || !password) {
    res.status(400).json({ message: 'id and password are required' });
    return;
  }

  if (id !== PHYSIOTHERAPIST.id || password !== PHYSIOTHERAPIST.password) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign(
    { id: PHYSIOTHERAPIST.id, role: PHYSIOTHERAPIST.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(200).json({
    message: 'login successful',
    token
  });
});

export default router;
