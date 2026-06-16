import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { chickenCoopManager } from "../core/chickenCoop";
import { createChickenCoopSchema, updateChickenCoopSchema, updateChickenCountSchema } from "../types/chickensCoop";
import { Criteria } from "../types/shared";

const app = new Hono();

app.get(
  "/:id",
  async (c) => {
    const id = c.req.param("id");
    const result = await chickenCoopManager.findChickenCoop.findById(id);
    return c.json(result);
  },
);

app.post(
  "/",
  zValidator("json", createChickenCoopSchema),
  async (c) => {
    const data = c.req.valid("json");
    const chickenCoop = await chickenCoopManager.createChickenCoop.create(data);
    return c.json(chickenCoop, 201);
  },
);

app.post(
  "/list",
  zValidator("json", Criteria),
  async (c) => {
    const criteria = c.req.valid("json");
    const result = await chickenCoopManager.searchChickenCoop.search(criteria);
    return c.json(result);
  },
);

app.put(
  "/:id",
  zValidator("json", updateChickenCoopSchema),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    const chickenCoop = await chickenCoopManager.updateChickenCoop.update(id, data);
    return c.json(chickenCoop);
  },
);

app.patch(
  "/:id",
  zValidator("json", updateChickenCountSchema),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    const chickenCoop = await chickenCoopManager.updateChickenCount.updateChickenCount(id, data.chickensCount);
    return c.json(chickenCoop);
  },
);

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await chickenCoopManager.deleteChickenCoop.delete(id);
  return c.json({ message: "Gallinero eliminado exitosamente" });
});

export default app;
