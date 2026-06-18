import { CellphoneModel } from "../../shared/models/Cellphone";

export interface CellphoneInput {
  serial_number: string;
  price: number;
  model: string;
  year_launched: number;
  brand: string;
  camera_quality: string;
}

export class CellphoneRepository {
  async create(input: CellphoneInput) {
    const cellphone = await CellphoneModel.create(input);
    return cellphone.toObject();
  }

  async findAll() {
    return CellphoneModel.find().lean();
  }

  async findAllSortedByPrice(order: "asc" | "desc") {
    const sortDirection = order === "asc" ? 1 : -1;
    return CellphoneModel.find().sort({ price: sortDirection }).lean();
  }

  async countAll() {
    return CellphoneModel.countDocuments();
  }
}
