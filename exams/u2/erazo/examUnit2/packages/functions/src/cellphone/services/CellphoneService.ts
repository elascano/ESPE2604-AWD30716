import type { CellphoneInput, CellphoneRepository } from "../repositories/CellphoneRepository";

export class CellphoneService {
  constructor(private readonly cellphoneRepository: CellphoneRepository) {}

  async createCellphone(input: CellphoneInput) {
    return this.cellphoneRepository.create(input);
  }

  async listCellphones() {
    return this.cellphoneRepository.findAll();
  }
}
