import z from "zod";

export const createChickenCoopSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  description: z.string().optional(),
  chickensCount: z.number().nonnegative('La cantidad de pollos no puede ser negativa'),
  isActive: z.boolean().default(true),
});

export const updateChickenCoopSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  chickensCount: z.number().nonnegative('La cantidad de pollos no puede ser negativa').optional(),
});

export const updateChickenCountSchema = z.object({
  chickensCount: z.number().nonnegative('La cantidad de pollos no puede ser negativa'),
});

export const paginationSchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
});
