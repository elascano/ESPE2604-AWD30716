import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../db';

const supplyRouter = Router();

supplyRouter.get('/supplies', async (req: Request, res: Response) => {
  try {
    const inventory = await prisma.supplies.findMany();
    return res.status(200).json(inventory);
  } catch {
    return res.status(500).json({ error: "Unable to fetch inventory." });
  }
});

supplyRouter.get('/supplies/quantity-thresholds/:maxQuantity', async (req: Request, res: Response) => {
  try {
    const maxQuantity = parseInt(String(req.params.maxQuantity), 10);
    if (isNaN(maxQuantity)) {
      return res.status(400).json({ error: "Invalid maximum quantity format." });
    }
    const filteredSupplies = await prisma.supplies.findMany({
      where: {
        quantity: {
          lte: maxQuantity,
        },
      },
    });
    return res.status(200).json(filteredSupplies);
  } catch {
    return res.status(500).json({ error: "Database error while filtering supply quantities." });
  }
});

supplyRouter.get('/supplies/statuses/:statusValue', async (req: Request, res: Response) => {
  try {
    const statusValue = String(req.params.statusValue);
    if (statusValue !== 'Expired' && statusValue !== 'NextExpiration' && statusValue !== 'Current') {
      return res.status(400).json({ error: "Provided status value does not exist." });
    }
    const filteredSupplies = await prisma.supplies.findMany({
      where: {
        status: statusValue,
      },
    });
    return res.status(200).json(filteredSupplies);
  } catch {
    return res.status(500).json({ error: "Database error while filtering supply statuses." });
  }
});

supplyRouter.post('/supply', async (req: Request, res: Response) => {
  try {
    const { supplyName, quantity, unitCost, orderDate, expirationDate } = req.body;
    if (!supplyName || quantity === undefined || unitCost === undefined || !orderDate || !expirationDate) {
      return res.status(400).json({ error: "Missing supply data." });
    }
    await prisma.supplies.create({
      data: {
        supplyName,
        quantity: parseInt(quantity, 10),
        unitCost: new Prisma.Decimal(unitCost),
        orderDate: new Date(orderDate),
        expirationDate: new Date(expirationDate),
        status: 'Current',
      },
    });
    return res.status(201).json({ success: true, message: "Supply added" });
  } catch {
    return res.status(500).json({ error: "Could not add supply." });
  }
});

supplyRouter.put('/supplies/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { supplyName, quantity, unitCost, orderDate, expirationDate } = req.body;
    let supplyId: bigint;
    try {
      supplyId = BigInt(String(id));
    } catch {
      return res.status(400).json({ error: "Invalid supply ID or quantity." });
    }
    if (quantity !== undefined && (isNaN(Number(quantity)) || quantity < 0)) {
      return res.status(400).json({ error: "Invalid supply ID or quantity." });
    }
    const updateData: any = {};
    if (supplyName !== undefined) updateData.supplyName = supplyName;
    if (quantity !== undefined) updateData.quantity = parseInt(quantity, 10);
    if (unitCost !== undefined) updateData.unitCost = new Prisma.Decimal(unitCost);
    if (orderDate !== undefined) updateData.orderDate = new Date(orderDate);
    if (expirationDate !== undefined) updateData.expirationDate = new Date(expirationDate);

    await prisma.supplies.update({
      where: { id: supplyId },
      data: updateData,
    });
    return res.status(200).json({ success: true, message: "Supply updated" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ error: "Supply not found." });
    }
    return res.status(400).json({ error: "Invalid supply ID or quantity." });
  }
});

supplyRouter.delete('/supplies/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let supplyId: bigint;
    try {
      supplyId = BigInt(String(id));
    } catch {
      return res.status(400).json({ error: "Supply ID required." });
    }
    await prisma.supplies.delete({
      where: { id: supplyId },
    });
    return res.status(200).json({ success: true, message: "Supply deleted" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ error: "Supply not found." });
    }
    return res.status(500).json({ error: "Deletion failed." });
  }
});

export default supplyRouter;