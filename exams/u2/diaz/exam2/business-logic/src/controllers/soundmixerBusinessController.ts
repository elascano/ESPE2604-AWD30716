import { Request, Response } from 'express';

// When deployed on Lambda, CRUD_API_URL is the full API Gateway URL of the CRUD Lambda
// e.g.: https://abc123.execute-api.us-east-1.amazonaws.com/store
// When running locally, set CRUD_API_URL=http://localhost:3000/store
const CRUD_API_URL = process.env.CRUD_API_URL ?? '';

/**
 * POST /store
 * Business rule: applies a 10% discount when status is NOT "new".
 * Then forwards the (possibly discounted) payload to the CRUD service.
 */
export const createSoundmixer = async (req: Request, res: Response) => {
  try {
    const { serialNumber, brand, model, description, price, status } = req.body;

    if (!serialNumber || !brand || !model || price === undefined || !status) {
      return res.status(400).json({
        error: 'Missing soundmixer data. Required: serialNumber, brand, model, price, status.',
      });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ error: 'Invalid price value.' });
    }

    // Business rule: 10% discount when status is NOT "new"
    const isNew = String(status).toLowerCase() === 'new';
    const finalPrice = isNew
      ? numericPrice
      : parseFloat((numericPrice * 0.9).toFixed(2));

    console.log(`[BL] Calling CRUD POST → ${CRUD_API_URL}`);
    console.log(`[BL] isNew=${isNew} | originalPrice=${numericPrice} | finalPrice=${finalPrice}`);

    const createResponse = await fetch(CRUD_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serialNumber,
        brand,
        model,
        description,
        price: finalPrice,
        status,
      }),
    });

    console.log(`[BL] CRUD response status: ${createResponse.status}`);

    if (!createResponse.ok) {
      const text = await createResponse.text().catch(() => '');
      return res.status(502).json({
        error: 'Failed to create soundmixer in CRUD service.',
        details: text,
      });
    }

    const created = await createResponse.json().catch(() => ({}));

    return res.status(201).json({
      success: true,
      data: created,
      originalPrice: numericPrice,
      finalPrice,
      discountApplied: isNew ? '0%' : '10%',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Could not create soundmixer.',
      details: String(error),
    });
  }
};
