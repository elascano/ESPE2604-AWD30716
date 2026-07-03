import { Controller, Get, Headers, Query } from "@nestjs/common";
import { ApiOrdersService } from "./api-orders.service";

@Controller("api/v1/orders")
export class ApiOrdersController {
  constructor(private readonly apiOrdersService: ApiOrdersService) {}

  @Get()
  findAll(
    @Headers("x-user-id") userId: string,
    @Query("status") status?: string,
    @Query("from") from?: string,
    @Query("to") to?: string,
  ) {
    return this.apiOrdersService.findAll(userId, { status, from, to });
  }
}
