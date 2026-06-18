import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { buildCellphoneController } from "./bootstrap";

export async function handler(event: APIGatewayProxyEventV2) {
  const controller = await buildCellphoneController();
  return controller.create(event);
}
