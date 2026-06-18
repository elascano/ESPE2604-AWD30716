import type { IChickenCoopRepository } from "../Domain/IChickensCoopRespository";

  export class Delete {
  constructor(private chickenCoopRepository: IChickenCoopRepository) {}

  delete = async(id: string): Promise<boolean> => {
    const chickenCoop = await this.chickenCoopRepository.delete(id);
    if (!chickenCoop) {
      throw new Error("ChickenCoop not found");
    }
    return chickenCoop;
  }
}
