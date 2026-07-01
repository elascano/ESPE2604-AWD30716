import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../db';

const userRouter = Router();

userRouter.get('/users/:username', async (req: Request, res: Response) => {
  try {
    const username = String(req.params.username);
    const user = await prisma.users.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    return res.status(200).json(user);
  } catch {
    return res.status(500).json({ error: "Database error while fetching user." });
  }
});

userRouter.post('/users', async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ error: "Missing required fields or invalid role." });
    }
    if (role !== 'Administrator' && role !== 'Dentist' && role !== 'Receptionist') {
      return res.status(400).json({ error: "Missing required fields or invalid role." });
    }
    await prisma.users.create({
      data: {
        username,
        password,
        role,
      },
    });
    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(400).json({ error: "Missing required fields or invalid role." });
    }
    return res.status(500).json({ error: "Database error while registering user." });
  }
});

export default userRouter;