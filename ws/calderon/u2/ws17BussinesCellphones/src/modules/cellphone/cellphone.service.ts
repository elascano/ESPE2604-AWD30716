import { CellphoneRepository } from "./cellphone.repository";
import { CellphoneRules } from "./cellphone.rules";

export class CellphoneService {

  private repository =
    new CellphoneRepository();

  async findAll() {

    const phones =
      await this.repository.findAll();

    return phones.map(phone => ({
      ...phone,

      tier:
        CellphoneRules.calculateTier(
          phone.price
        ),

      recommendation:
        CellphoneRules.calculateRecommendation(
          phone.releaseDate
        )
    }));
  }

  async create(data: any) {
    return this.repository.create(data);
  }

  async findById(id: string) {

    const phone =
      await this.repository.findById(id);

    if (!phone)
      return null;

    return {
      ...phone,
      tier:
        CellphoneRules.calculateTier(
          phone.price
        ),
      recommendation:
        CellphoneRules.calculateRecommendation(
          phone.releaseDate
        )
    };
  }
}