import type { ChickenCoop } from "../Domain/ChickenCoop";
import type { IChickenCoopRepository } from "../Domain/IChickensCoopRespository";

export class Find {
  constructor(private chickenCoopRepository: IChickenCoopRepository) {}

  findById = async(id: string): Promise<ChickenCoop | null> => {
    const chickenCoop = await this.chickenCoopRepository.findById(id);
    if (!chickenCoop) {
      throw new Error("ChickenCoop not found");
    }
    return chickenCoop;
  }
}
