import type { Criteria } from "@shared/criteria";
import type { ChickenCoop } from "./ChickenCoop";
import type { CreateChickenCoopDto, UpdateChickenCoopDto } from "./ChikenCoopDto";

export interface IChickenCoopRepository {
  findById(id: string): Promise<ChickenCoop | null>;
  create(data: CreateChickenCoopDto): Promise<ChickenCoop>;
  update(id: string, data: UpdateChickenCoopDto): Promise<ChickenCoop | null>;
  delete(id: string): Promise<boolean>;
  search(criteria: Criteria): Promise<ChickenCoop[]>;
  count(criteria: Criteria): Promise<number>;
  updateChickenCount(id: string, count: number): Promise<ChickenCoop | null>;
}
