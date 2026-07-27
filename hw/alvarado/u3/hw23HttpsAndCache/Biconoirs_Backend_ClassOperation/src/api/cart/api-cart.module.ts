import { Module } from "@nestjs/common";
import { ApiCartController } from "./api-cart.controller";
import { ApiCartService } from "./api-cart.service";

@Module({
  controllers: [ApiCartController],
  providers: [ApiCartService],
})
export class ApiCartModule {}
