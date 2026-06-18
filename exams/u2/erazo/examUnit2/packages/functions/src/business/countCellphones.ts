import { buildBusinessController } from "./bootstrap";

export async function handler() {
  const controller = await buildBusinessController();
  return controller.count();
}
