import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { tokenBlacklist } from '../middleware/checkRole';

const CRUD_BASE_URL = `http://${process.env.CRUD_API_IP || 'localhost'}:3000`;
const CRUD_API_KEY = process.env.CRUD_API_KEY || '';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required.' });
  }

  try {
    const crudResponse = await fetch(
      `${CRUD_BASE_URL}/fabuladental/users/${encodeURIComponent(username)}`,
      {
        headers: { 'x-api-key': CRUD_API_KEY },
      }
    );

    if (!crudResponse.ok) {
      return res.status(401).json({ error: 'Authentication failure. Invalid credentials.' });
    }

    const user = await crudResponse.json() as { username: string; password: string; role: string };

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failure. Invalid credentials.' });
    }

    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login successful.',
      token,
      role: user.role,
    });

  } catch {
    return res.status(500).json({ error: 'Internal error attempting to authenticate.' });
  }
};

export const logout = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ error: 'No token found in the Authorization header.' });
  }

  const token = authHeader.split(' ')[1];

  tokenBlacklist.add(token);

  return res.status(200).json({ message: 'Session successfully closed.' });
};

export const register = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields or invalid role.' });
  }

  if (role !== 'Administrator' && role !== 'Dentist' && role !== 'Receptionist') {
    return res.status(400).json({ error: 'Missing required fields or invalid role.' });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const crudResponse = await fetch(`${CRUD_BASE_URL}/fabuladental/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CRUD_API_KEY,
      },
      body: JSON.stringify({
        username,
        password: hashedPassword,
        role,
      }),
    });

    if (!crudResponse.ok) {
      return res.status(400).json({ error: 'Missing required fields or invalid role.' });
    }

    return res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch {
    return res.status(500).json({ error: 'Internal error while trying to register the user.' });
  }
};
