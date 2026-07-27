import { Module } from "@nestjs/common";
import { ApiCheckoutController } from "./api-checkout.controller";
import { ApiCheckoutService } from "./api-checkout.service";

@Module({
  controllers: [ApiCheckoutController],
  providers: [ApiCheckoutService],
})
export class ApiCheckoutModule {}
