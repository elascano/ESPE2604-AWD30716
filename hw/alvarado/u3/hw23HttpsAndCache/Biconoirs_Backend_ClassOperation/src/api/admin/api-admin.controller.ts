import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ApiAdminService } from "./api-admin.service";
import { AdminCreateInventoryDto } from "./dto/admin-create-inventory.dto";
import { AdminUpdateInventoryDto } from "./dto/admin-update-inventory.dto";

@Controller("api/v1/admin")
export class ApiAdminController {
  constructor(private readonly apiAdminService: ApiAdminService) {}

  @Get("inventory")
  findAllInventory(@Headers("x-user-id") userId: string) {
    return this.apiAdminService.findAllInventory(userId);
  }

  @Post("inventory")
  @HttpCode(201)
  createInventory(@Headers("x-user-id") userId: string, @Body() dto: AdminCreateInventoryDto) {
    return this.apiAdminService.createInventory(userId, dto);
  }

  @Put("inventory/:inventoryId")
  updateInventoryPut(
    @Headers("x-user-id") userId: string,
    @Param("inventoryId") inventoryId: string,
    @Body() dto: AdminUpdateInventoryDto,
  ) {
    return this.apiAdminService.updateInventory(userId, inventoryId, dto);
  }

  @Patch("inventory/:inventoryId")
  updateInventoryPatch(
    @Headers("x-user-id") userId: string,
    @Param("inventoryId") inventoryId: string,
    @Body() dto: AdminUpdateInventoryDto,
  ) {
    return this.apiAdminService.updateInventory(userId, inventoryId, dto);
  }

  @Delete("inventory/:inventoryId")
  @HttpCode(204)
  removeInventory(
    @Headers("x-user-id") userId: string,
    @Param("inventoryId") inventoryId: string,
  ) {
    return this.apiAdminService.removeInventory(userId, inventoryId);
  }

  @Get("analytics")
  getAnalytics(
    @Headers("x-user-id") userId: string,
    @Query("from") from?: string,
    @Query("to") to?: string,
  ) {
    return this.apiAdminService.getAnalytics(userId, { from, to });
  }
}
