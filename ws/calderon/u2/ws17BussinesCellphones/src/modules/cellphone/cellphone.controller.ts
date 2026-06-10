import { CellphoneService } from "./cellphone.service";

const service =
  new CellphoneService();

export class CellphoneController {

  async getAll() {
    return service.findAll();
  }

  async getById(id: string) {
    return service.findById(id);
  }

  async create(data: any) {
    return service.create(data);
  }
}