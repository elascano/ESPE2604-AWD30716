import { Request, Response } from 'express';

const API_BASE_URL = `http://${process.env.CRUD_API_IP}:3000/fabuladental/supplies`;
const CRUD_API_KEY = process.env.CRUD_API_KEY || '';

export const updateExpirationStatus = async (req: Request, res: Response) => {
  try {
    const response = await fetch(API_BASE_URL, {
      headers: { 'x-api-key': CRUD_API_KEY }
    });
    if (!response.ok) throw new Error();
    const supplies = await response.json();

    const currentDate = new Date();
    let processedItems = 0;

    for (const item of supplies) {
      const expDate = new Date(item.expirationDate);
      const diffTime = expDate.getTime() - currentDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let newStatus = 'Current';
      if (diffDays < 0) {
        newStatus = 'Expired';
      } else if (diffDays <= 30) {
        newStatus = 'NextExpiration';
      }

      if (item.status !== newStatus) {
        const updateResponse = await fetch(`${API_BASE_URL}/${item.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': CRUD_API_KEY
          },
          body: JSON.stringify({
            supplyName: item.supplyName,
            quantity: item.quantity,
            unitCost: item.unitCost,
            orderDate: item.orderDate,
            expirationDate: item.expirationDate,
            status: newStatus
          })
        });

        if (updateResponse.ok) processedItems++;
      }
    }

    res.status(200).json({
      success: true,
      message: "Supplies expiration status successfully updated.",
      processedItems
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate or update expiration statuses." });
  }
};

export const getAssetValuation = async (req: Request, res: Response) => {
  try {
    const response = await fetch(API_BASE_URL, {
      headers: { 'x-api-key': CRUD_API_KEY }
    });
    if (!response.ok) throw new Error();
    const supplies = await response.json();

    const totalInventoryValue = supplies.reduce((sum: number, item: any) => sum + (item.quantity * item.unitCost), 0);

    res.status(200).json({
      totalInventoryValue: parseFloat(totalInventoryValue.toFixed(2)),
      currency: "USD",
      calculatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: "Unable to compile asset valuation data. " });
  }
};

export const getRestockProvisions = async (req: Request, res: Response) => {
  try {
    const response = await fetch(API_BASE_URL, {
      headers: { 'x-api-key': CRUD_API_KEY }
    });
    if (!response.ok) throw new Error();
    const supplies = await response.json();

    const lowStockItems = supplies.filter((item: any) => item.quantity <= 5);
    let consolidatedRestockBudget = 0;

    const itemsToPurchase = lowStockItems.map((item: any) => {
      const unitsToOrder = 15 - item.quantity;
      const estimatedCost = unitsToOrder * item.unitCost;
      consolidatedRestockBudget += estimatedCost;

      return {
        id: item.id,
        supplyName: item.supplyName,
        unitsToOrder,
        estimatedCost: parseFloat(estimatedCost.toFixed(2))
      };
    });

    res.status(200).json({
      consolidatedRestockBudget: parseFloat(consolidatedRestockBudget.toFixed(2)),
      currency: "USD",
      itemsToPurchase
    });
  } catch (error) {
    res.status(500).json({ error: "Unable to calculate restock provisioning analysis." });
  }
};

export const getExpirationLosses = async (req: Request, res: Response) => {
  try {
    const response = await fetch(API_BASE_URL, {
      headers: { 'x-api-key': CRUD_API_KEY }
    });
    if (!response.ok) throw new Error();
    const supplies = await response.json();

    const expiredItems = supplies.filter((item: any) => item.status === 'Expired');
    const totalLossAmount = expiredItems.reduce((sum: number, item: any) => sum + (item.quantity * item.unitCost), 0);

    res.status(200).json({
      totalLossAmount: parseFloat(totalLossAmount.toFixed(2)),
      currency: "USD",
      expiredItemsCount: expiredItems.length,
      calculatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: "Could not calculate historical expiration losses." });
  }
};

export const getCapitalRisks = async (req: Request, res: Response) => {
  try {
    const response = await fetch(API_BASE_URL, {
      headers: { 'x-api-key': CRUD_API_KEY }
    });
    if (!response.ok) throw new Error();
    const supplies = await response.json();

    const riskItems = supplies.filter((item: any) => item.status === 'NextExpiration');
    const totalCapitalAtRisk = riskItems.reduce((sum: number, item: any) => sum + (item.quantity * item.unitCost), 0);

    res.status(200).json({
      totalCapitalAtRisk: parseFloat(totalCapitalAtRisk.toFixed(2)),
      currency: "USD",
      riskPeriod: "30 Days or Less",
      itemsNearExpirationCount: riskItems.length
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to compile the expiration capital risk assessment." });
  }
};