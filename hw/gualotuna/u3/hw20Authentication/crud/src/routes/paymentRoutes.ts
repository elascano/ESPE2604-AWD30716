import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../db';

const paymentRouter = Router();

type PaymentPayload = {
  patientID?: string | number;
  amount?: string | number;
  date?: string;
  paymentType?: string;
  paymentMethod?: string;
};

const validPaymentTypes = ['Deposit', 'Final'];
const validPaymentMethods = ['Cash', 'Card', 'Transfer'];

function parsePaymentId(value: unknown): bigint | null {
  if (value === undefined || value === null || String(value).trim() === '') {
    return null;
  }

  try {
    return BigInt(String(value));
  } catch {
    return null;
  }
}

function calculateStatus(paymentType: string): string {
  return paymentType === 'Final' ? 'Completed' : 'Partial';
}

function validatePaymentPayload(payload: PaymentPayload) {
  const patientID = payload.patientID?.toString().trim();
  const amount = payload.amount;
  const date = payload.date?.toString().trim();
  const paymentType = payload.paymentType?.toString().trim();
  const paymentMethod = payload.paymentMethod?.toString().trim();

  if (
    !patientID ||
    !/^[0-9]{10}$/.test(patientID) ||
    amount === undefined ||
    amount === null ||
    Number.isNaN(Number(amount)) ||
    Number(amount) <= 0 ||
    !date ||
    !paymentType ||
    !validPaymentTypes.includes(paymentType) ||
    !paymentMethod ||
    !validPaymentMethods.includes(paymentMethod)
  ) {
    return null;
  }

  const paymentDate = new Date(date);
  if (Number.isNaN(paymentDate.getTime())) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (paymentDate > today) {
    return null;
  }

  return {
    patientID,
    amount: Number(amount),
    date: paymentDate,
    paymentType,
    paymentMethod,
  };
}

// Data source consumed by the Business Logic server (mirrors GET /supplies).
paymentRouter.get('/payments', async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payments.findMany();
    return res.status(200).json(payments);
  } catch {
    return res.status(500).json({ error: "Unable to fetch payment history." });
  }
});

// 3. Record a payment
paymentRouter.post('/payments', async (req: Request, res: Response) => {
  try {
    const payment = validatePaymentPayload(req.body);
    if (!payment) {
      return res.status(400).json({ error: "Invalid payment data." });
    }

    await prisma.payments.create({
      data: {
        patientID: payment.patientID,
        amount: new Prisma.Decimal(payment.amount),
        date: payment.date,
        paymentType: payment.paymentType,
        paymentMethod: payment.paymentMethod,
        status: calculateStatus(payment.paymentType),
      },
    });

    return res.status(201).json({ success: true, message: "Payment recorded" });
  } catch {
    return res.status(500).json({ error: "Could not record payment." });
  }
});

// 1. Update payment history
paymentRouter.put('/payments/:paymentId', async (req: Request, res: Response) => {
  try {
    const id = parsePaymentId(req.params.paymentId);
    if (id === null) {
      return res.status(400).json({ error: "Invalid payment ID or data." });
    }

    const payment = validatePaymentPayload(req.body);
    if (!payment) {
      return res.status(400).json({ error: "Invalid payment ID or data." });
    }

    await prisma.payments.update({
      where: { id },
      data: {
        patientID: payment.patientID,
        amount: new Prisma.Decimal(payment.amount),
        date: payment.date,
        paymentType: payment.paymentType,
        paymentMethod: payment.paymentMethod,
        status: calculateStatus(payment.paymentType),
        updated_at: new Date(),
      },
    });

    return res.status(200).json({ success: true, message: "Payment updated" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ error: "Payment record not found." });
    }

    return res.status(400).json({ error: "Invalid payment ID or data." });
  }
});

// 2. Delete a payment record
paymentRouter.delete('/payments', async (req: Request, res: Response) => {
  try {
    const id = parsePaymentId(req.query.id ?? req.body?.id);
    if (id === null) {
      return res.status(400).json({ error: "Payment ID required." });
    }

    await prisma.payments.delete({
      where: { id },
    });

    return res.status(200).json({ success: true, message: "Payment deleted" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ error: "Payment not found." });
    }

    return res.status(500).json({ error: "Deletion failed." });
  }
});

export default paymentRouter;
