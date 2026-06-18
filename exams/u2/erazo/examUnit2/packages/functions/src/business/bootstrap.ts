import { connectToDatabase } from "../shared/database/mongoose";
import { BusinessController } from "./controllers/BusinessController";
import { BusinessService } from "./services/BusinessService";
import { CellphoneRepository } from "../cellphone/repositories/CellphoneRepository";

export async function buildBusinessController(): Promise<BusinessController> {
  await connectToDatabase();

  const cellphoneRepository = new CellphoneRepository();
  const businessService = new BusinessService(cellphoneRepository);

  return new BusinessController(businessService);
}
