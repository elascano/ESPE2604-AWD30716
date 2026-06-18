  import type { Criteria } from "@shared/criteria";
import type { ChickenCoop } from "../Domain/ChickenCoop";
import type { IChickenCoopRepository } from "../Domain/IChickensCoopRespository";

export class Search {
  constructor(private chickenCoopRepository: IChickenCoopRepository) {}

  search = async (
    criteria: Criteria,
  ): Promise<{ data: ChickenCoop[]; total: number }> => {
    const [chickenCoops, total] = await Promise.all([
      this.chickenCoopRepository.search(criteria),
      this.chickenCoopRepository.count(criteria),
    ]);

    return {
      data: chickenCoops,
      total,
    };
  };
}
