import z from "zod";

const operator = z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike', 'in']);

export const Filter = z.object({
  field: z.string(),
  value: z.unknown(),
  operator: operator,
});

export const Criteria = z.object({
  limit: z.number().optional().default(10),
  offset: z.number().optional().default(0),
  filters: z.array(Filter).optional(),
});
