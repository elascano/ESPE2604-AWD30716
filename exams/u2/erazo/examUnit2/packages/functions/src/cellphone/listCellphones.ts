import { buildCellphoneController } from "./bootstrap";

export async function handler() {
  const controller = await buildCellphoneController();
  return controller.list();
}
