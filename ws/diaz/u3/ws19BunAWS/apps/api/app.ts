import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import chickenCoopRoutes from "./routes/chickensCoop";

export const app = new Hono();

app.use('*', logger());
app.use('*', cors());

app.get('/api', (c) => {
  return c.json({
    message: 'Chickens API is running',
    version: '1.0.0',
    endpoints: {
      'GET /api/chickenCoop/:id': 'Get a chicken coop by ID',
      'POST /api/chickenCoop': 'Create a new chicken coop',
      'POST /api/chickenCoop/list': 'Search chicken coops with criteria',
      'PATCH /api/chickenCoop/:id': 'Update chicken count in a coop',
      'DELETE /api/chickenCoop/:id': 'Delete a chicken coop',
    },
  });
});

app.route('/api/chickenCoop', chickenCoopRoutes);

app.notFound((c) => {
  return c.json({ error: { code: 'NOT_FOUND', message: 'Ruta no encontrada' } }, 404);
});

const port = process.env.PORT || 3000;

console.log(`Server running on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
