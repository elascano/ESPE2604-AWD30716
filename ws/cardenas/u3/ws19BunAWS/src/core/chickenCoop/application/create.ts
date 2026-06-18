import type { ChickenCoop } from "../Domain/ChickenCoop";
import type { CreateChickenCoopDto } from "../Domain/ChikenCoopDto";
import type { IChickenCoopRepository } from "../Domain/IChickensCoopRespository";

  export class Create {
  constructor(
    private chickenCoopRepository: IChickenCoopRepository,
  ) {}

  create = async (data: CreateChickenCoopDto): Promise<ChickenCoop> => {
    const chickenCoop = await this.chickenCoopRepository.create(data);
    if (data.chickensCount > 0) {
      await this.chickenCoopRepository.updateChickenCount(chickenCoop.id, data.chickensCount);
    }
    return chickenCoop;
  };
}
