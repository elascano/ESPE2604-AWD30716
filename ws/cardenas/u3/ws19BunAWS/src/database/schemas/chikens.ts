import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const chickenCoop = pgTable("chicken_coop", {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  chickensCount: integer('chickens_count').notNull().default(0),
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
