
import { eq, and, desc, count, sql } from "drizzle-orm";

import { extractFilters, type Criteria } from "@shared/criteria";
import type { IChickenCoopRepository } from "../Domain/IChickensCoopRespository";
import { chickenCoop } from "@database/schemas/chikens";
import type { ChickenCoop } from "../Domain/ChickenCoop";
import type { Database } from "@database/conection";
import type { CreateChickenCoopDto, UpdateChickenCoopDto } from "../Domain/ChikenCoopDto";
export class ChickenCoopDrizzleRepository implements IChickenCoopRepository {

  private readonly columnMap = {
    id: chickenCoop.id,
    name: chickenCoop.name,
    chickensCount: chickenCoop.chickensCount,
    description: chickenCoop.description,
    isActive: chickenCoop.isActive,
    createdAt: chickenCoop.createdAt,
    updatedAt: chickenCoop.updatedAt,
  };

  constructor(private db: Database) {}

  findById = async (id: string): Promise<ChickenCoop | null> => {
    const result = await this.db
      .select()
      .from(chickenCoop)
      .where(and(eq(chickenCoop.id, id), eq(chickenCoop.isActive, true)))
      .limit(1);

    return result[0] || null;
  };

  findByName = async (name: string): Promise<ChickenCoop | null> => {
    const result = await this.db
      .select()
      .from(chickenCoop)
      .where(and(eq(chickenCoop.name, name), eq(chickenCoop.isActive, true)))
      .limit(1);

    return result[0] || null;
  };

  create = async (data: CreateChickenCoopDto): Promise<ChickenCoop> => {
    const result = await this.db
      .insert(chickenCoop)
      .values({
        name: data.name,
        chickensCount: data.chickensCount,
        description: data.description,
        isActive: data.isActive,
      })
      .returning();

    if (!result[0]) {
      throw new Error("Failed to create chicken coop");
    }

    if (!result[0]) {
      throw new Error("Failed to create chicken coop");
    }

    return result[0];
  };

  update = async (
    id: string,
    data: UpdateChickenCoopDto,
  ): Promise<ChickenCoop | null> => {
    const updateData: any = { updatedAt: new Date() };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.chickensCount !== undefined) updateData.chickensCount = data.chickensCount;

    const result = await this.db
      .update(chickenCoop)
      .set(updateData)
      .where(eq(chickenCoop.id, id))
      .returning();

    return result[0] || null;
  };

  delete = async (id: string): Promise<boolean> => {
    const result = await this.db
      .update(chickenCoop)
      .set({ isActive: false })
      .where(eq(chickenCoop.id, id))
      .returning();

    return result.length > 0;
  };

  search = async (criteria: Criteria): Promise<ChickenCoop[]> => {
    const whereCondition = extractFilters(criteria.filters, this.columnMap);

    const chickenCoopsList = await this.db
      .select()
      .from(chickenCoop)
      .where(whereCondition)
      .orderBy(desc(chickenCoop.createdAt))
      .limit(criteria.limit)
      .offset(criteria.offset);

    return chickenCoopsList;
  };

  count = async (criteria: Criteria): Promise<number> => {
    const whereCondition = extractFilters(criteria.filters, this.columnMap);

    const totalCount = await this.db
      .select({ count: count() })
      .from(chickenCoop)
      .where(whereCondition);

    return totalCount[0]?.count || 0;
  };

  updateChickenCount = async (
    id: string,
    quantity: number,
  ): Promise<ChickenCoop | null> => {
    const result = await this.db
      .update(chickenCoop)
      .set({
        chickensCount: quantity,
        updatedAt: new Date(),
      })
      .where(eq(chickenCoop.id, id))
      .returning();

    return result[0] || null;
  };
}
