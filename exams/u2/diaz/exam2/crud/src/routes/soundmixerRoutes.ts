import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../db';

const soundmixerRouter = Router();


soundmixerRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { serialNumber, brand, model, description, price, status } = req.body;

    if (!serialNumber || !brand || !model || price === undefined || !status) {
      return res.status(400).json({ error: 'Missing soundmixer data. Required: serialNumber, brand, model, price, status.' });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ error: 'Invalid price value.' });
    }

    const record = await prisma.supplies.create({
      data: {
        serialNumber,
        brand,
        model,
        description: description || null,
        price: new Prisma.Decimal(numericPrice),
        status,
      },
    });

    return res.status(201).json({ success: true, message: 'Soundmixer added', data: record });
  } catch (err) {
    return res.status(500).json({ error: 'Could not add soundmixer.', details: String(err) });
  }
});

export default soundmixerRouter;
