const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Disable browser caching for static files during development
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Mock data of products if the external API is offline or unreachable
const MOCK_PRODUCTS = [
  {
    id: "3517aad2-1086-444a-bccc-193be70a4a0a",
    barbershop_id: "bf338534-365a-4d8d-b45d-1e961e182467",
    name: "Shampoo Premium",
    description: "Shampoo profesional para hidratación profunda y cuidado del cuero cabelludo.",
    price: 15.50,
    stock: 12,
    image_url: null,
    is_active: true,
    created_at: "2026-05-14T02:08:01Z"
  },
  {
    id: "426be2e4-e0c2-4889-8d76-d183d2c88f11",
    barbershop_id: "bf338534-365a-4d8d-b45d-1e961e182467",
    name: "Cera Modeladora Matte",
    description: "Cera fijadora de efecto mate y fijación fuerte, ideal para peinados clásicos.",
    price: 12.99,
    stock: 4,
    image_url: null,
    is_active: true,
    created_at: "2026-05-15T09:12:44Z"
  },
  {
    id: "bd525141-893f-4e00-a548-8df0c6b12a32",
    barbershop_id: "bf338534-365a-4d8d-b45d-1e961e182467",
    name: "Aceite para Barba Woodsmoke",
    description: "Aceite natural con notas amaderadas para suavizar la barba y nutrir la piel.",
    price: 18.00,
    stock: 0,
    image_url: null,
    is_active: true,
    created_at: "2026-05-18T14:30:10Z"
  },
  {
    id: "78b23c52-78d1-4475-b6d1-d2ab8cb98144",
    barbershop_id: "bf338534-365a-4d8d-b45d-1e961e182467",
    name: "Navaja de Afeitar Clásica",
    description: "Navaja de acero inoxidable con mango de madera de roble, estilo tradicional.",
    price: 24.50,
    stock: 8,
    image_url: null,
    is_active: true,
    created_at: "2026-05-20T11:45:00Z"
  },
  {
    id: "ca1e4e2a-14db-40a2-aa51-b0db0cb18a47",
    barbershop_id: "bf338534-365a-4d8d-b45d-1e961e182467",
    name: "Tónico Anticaída 150ml",
    description: "Loción fortificante para estimular el crecimiento y frenar la caída del cabello.",
    price: 29.99,
    stock: 3,
    image_url: null,
    is_active: false,
    created_at: "2026-05-25T16:00:22Z"
  },
  {
    id: "11b22c33-44d5-55e6-66f7-77a88b99c0da",
    barbershop_id: "bf338534-365a-4d8d-b45d-1e961e182467",
    name: "Loción Aftershave Mentolada",
    description: "Loción refrescante y desinfectante para después del afeitado.",
    price: 9.50,
    stock: 25,
    image_url: null,
    is_active: true,
    created_at: "2026-06-01T08:15:30Z"
  },
  {
    id: "22c33d44-55e6-66f7-77a8-88b99c0da11b",
    barbershop_id: "bf338534-365a-4d8d-b45d-1e961e182467",
    name: "Acondicionador de Barba",
    description: "Hidratante suavizante profundo para uso diario en barbas secas.",
    price: 14.00,
    stock: 15,
    image_url: null,
    is_active: true,
    created_at: "2026-06-05T12:00:00Z"
  },
  {
    id: "33d44e55-66f7-77a8-88b9-9c0da11b22c3",
    barbershop_id: "bf338534-365a-4d8d-b45d-1e961e182467",
    name: "Gel de Afeitar Transparente",
    description: "Gel de precisión sin espuma para perfilados limpios.",
    price: 11.25,
    stock: 1,
    image_url: null,
    is_active: true,
    created_at: "2026-06-10T17:40:15Z"
  }
];

// Endpoint to proxy products from the external API
app.get('/api/products', async (req, res) => {
  try {
    console.log('Fetching products from external API...');
    const response = await axios.get('http://18.118.134.82:3000/products', {
      timeout: 5000 // 5 seconds timeout
    });
    
    if (Array.isArray(response.data)) {
      console.log(`Successfully fetched ${response.data.length} products from external API.`);
      return res.json({
        source: 'api',
        data: response.data
      });
    } else {
      throw new Error('API response is not an array');
    }
  } catch (error) {
    console.warn(`Warning: Could not fetch products from external API (${error.message}). Using local mock products.`);
    return res.json({
      source: 'fallback_mock',
      data: MOCK_PRODUCTS
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` Barbershop Products Report Server running locally`);
  console.log(` URL: http://localhost:${PORT}                      `);
  console.log(`==================================================`);
});
