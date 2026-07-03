import { Module } from "@nestjs/common";
import { ApiOrdersController } from "./api-orders.controller";
import { ApiOrdersService } from "./api-orders.service";

@Module({
  controllers: [ApiOrdersController],
  providers: [ApiOrdersService],
})
export class ApiOrdersModule {}
