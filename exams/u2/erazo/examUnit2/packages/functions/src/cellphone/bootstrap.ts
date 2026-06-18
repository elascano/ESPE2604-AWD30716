import { connectToDatabase } from "../shared/database/mongoose";
import { CellphoneController } from "./controllers/CellphoneController";
import { CellphoneRepository } from "./repositories/CellphoneRepository";
import { CellphoneService } from "./services/CellphoneService";

export async function buildCellphoneController(): Promise<CellphoneController> {
  await connectToDatabase();

  const cellphoneRepository = new CellphoneRepository();
  const cellphoneService = new CellphoneService(cellphoneRepository);

  return new CellphoneController(cellphoneService);
}
