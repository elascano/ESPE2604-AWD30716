import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiMenuService } from "./api-menu.service";

@Controller("api/v1/menu")
export class ApiMenuController {
  constructor(private readonly apiMenuService: ApiMenuService) {}

  @Get()
  findAll(
    @Query("category") category?: string,
    @Query("search") search?: string,
    @Query("available") available?: string,
    @Query("page") page?: string,
    @Query("perPage") perPage?: string,
  ) {
    return this.apiMenuService.findAll({ category, search, available, page, perPage });
  }

  @Get(":dishId")
  findOne(@Param("dishId") dishId: string) {
    return this.apiMenuService.findOne(dishId);
  }
}
