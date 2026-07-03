import { Module } from "@nestjs/common";
import { ApiMenuController } from "./api-menu.controller";
import { ApiMenuService } from "./api-menu.service";

@Module({
  controllers: [ApiMenuController],
  providers: [ApiMenuService],
})
export class ApiMenuModule {}
