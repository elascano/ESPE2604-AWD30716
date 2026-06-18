import type { ChickenCoop } from "../Domain/ChickenCoop";
import type { UpdateChickenCoopDto } from "../Domain/ChikenCoopDto";
import type { IChickenCoopRepository } from "../Domain/IChickensCoopRespository";

  export class Update {
  constructor(private chickenCoopRepository: IChickenCoopRepository) {}

  update = async(id: string,data: UpdateChickenCoopDto): Promise<ChickenCoop | null>  => {
    const chickenCoopToUpdate = await this.chickenCoopRepository.findById(id);
    if (!chickenCoopToUpdate) {
      throw new Error("ChickenCoop not found");
    }
    
    data.updatedAt = new Date();
    data.chickensCount = data.chickensCount ?? chickenCoopToUpdate.chickensCount;
    data.name = data.name ?? chickenCoopToUpdate.name;
    data.description = data.description ?? chickenCoopToUpdate.description;
    
    const chickenCoop = await this.chickenCoopRepository.update(id, data);
    if (!chickenCoop) {
      throw new Error("ChickenCoop not found");
    }
    return chickenCoop;
  }

  updateChickenCount = async(id: string, quantity: number): Promise<ChickenCoop | null> => {
    const chickenCoop = await this.chickenCoopRepository.updateChickenCount(id, quantity);
    if (!chickenCoop) {
      throw new Error("ChickenCoop not found");
    }
    return chickenCoop;
  }
}
