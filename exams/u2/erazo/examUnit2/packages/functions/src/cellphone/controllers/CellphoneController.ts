import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { z } from "zod";
import { parseJsonBody } from "../../shared/http/request";
import { errorResponse, jsonResponse } from "../../shared/http/response";
import type { CellphoneService } from "../services/CellphoneService";

const createCellphoneSchema = z.object({
  serial_number: z.string().min(1).max(100),
  price: z.number().min(0),
  model: z.string().min(1).max(200),
  year_launched: z.number().int(),
  brand: z.string().min(1).max(200),
  camera_quality: z.string().min(1).max(100)
});

export class CellphoneController {
  constructor(private readonly cellphoneService: CellphoneService) {}

  async create(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    try {
      const request = createCellphoneSchema.parse(parseJsonBody(event));
      const cellphone = await this.cellphoneService.createCellphone(request);
      return jsonResponse(201, cellphone);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async list(): Promise<APIGatewayProxyResultV2> {
    try {
      const cellphones = await this.cellphoneService.listCellphones();
      return jsonResponse(200, cellphones);
    } catch (error) {
      return errorResponse(error);
    }
  }
}
