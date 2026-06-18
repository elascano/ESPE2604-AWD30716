import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { getPathParameter } from "../../shared/http/request";
import { errorResponse, jsonResponse } from "../../shared/http/response";
import type { BusinessService } from "../services/BusinessService";

export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  async sortByPriceAsc(): Promise<APIGatewayProxyResultV2> {
    try {
      const cellphones = await this.businessService.sortByPrice("asc");
      return jsonResponse(200, cellphones);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async sortByPriceDesc(): Promise<APIGatewayProxyResultV2> {
    try {
      const cellphones = await this.businessService.sortByPrice("desc");
      return jsonResponse(200, cellphones);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async count(): Promise<APIGatewayProxyResultV2> {
    try {
      const result = await this.businessService.countCellphones();
      return jsonResponse(200, result);
    } catch (error) {
      return errorResponse(error);
    }
  }
}
