import { Request, Response } from 'express';

const API_BASE_URL = `http://${process.env.CRUD_API_IP}:3000/fabuladental/payments`;
const CRUD_API_KEY = process.env.CRUD_API_KEY || '';

const calculateStatus = (payment: any): string => {
  if (payment.paymentType === 'Final') {
    return 'Completed';
  }
  if (payment.paymentType === 'Deposit') {
    return 'Partial';
  }
  return 'Pending';
};

export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const response = await fetch(API_BASE_URL, {
      headers: { 'x-api-key': CRUD_API_KEY }
    });
    if (!response.ok) throw new Error();
    const payments = await response.json();

    const history = payments.map((payment: any) => ({
      paymentID: String(payment.id),
      patientID: payment.patientID,
      amount: parseFloat(payment.amount),
      status: calculateStatus(payment)
    }));

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch payment history." });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const paymentId = String(req.params.paymentId ?? '');
    if (!paymentId) {
      return res.status(400).json({ error: "Payment ID required." });
    }

    const response = await fetch(API_BASE_URL, {
      headers: { 'x-api-key': CRUD_API_KEY }
    });
    if (!response.ok) throw new Error();
    const payments = await response.json();

    const payment = payments.find((item: any) => String(item.id) === paymentId);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found." });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: String(payment.id),
        patientId: payment.patientID,
        amount: parseFloat(payment.amount),
        type: payment.paymentType,
        status: calculateStatus(payment),
        date: payment.date
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve payment details." });
  }
};

export const getPaymentsByPatient = async (req: Request, res: Response) => {
  try {
    const patientId = String(req.params.patientId ?? '');
    if (!patientId || !/^[0-9]{10}$/.test(patientId)) {
      return res.status(400).json({ error: "Invalid Patient ID parameter." });
    }

    const response = await fetch(API_BASE_URL, {
      headers: { 'x-api-key': CRUD_API_KEY }
    });
    if (!response.ok) throw new Error();
    const payments = await response.json();

    const patientPayments = payments.filter((item: any) => String(item.patientID) === patientId);
    if (patientPayments.length === 0) {
      return res.status(404).json({ error: "Patient not found or no payment records discovered." });
    }

    return res.status(200).json({
      success: true,
      data: patientPayments.map((payment: any) => ({
        id: String(payment.id),
        amount: parseFloat(payment.amount),
        type: payment.paymentType,
        status: calculateStatus(payment),
        date: payment.date
      }))
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve patient payment history." });
  }
};
