import type { CellphoneRepository } from "../../cellphone/repositories/CellphoneRepository";

export class BusinessService {
  constructor(private readonly cellphoneRepository: CellphoneRepository) {}

  async sortByPrice(order: "asc" | "desc") {
    return this.cellphoneRepository.findAllSortedByPrice(order);
  }

  async countCellphones() {
    const count = await this.cellphoneRepository.countAll();
    return { count };
  }
}
