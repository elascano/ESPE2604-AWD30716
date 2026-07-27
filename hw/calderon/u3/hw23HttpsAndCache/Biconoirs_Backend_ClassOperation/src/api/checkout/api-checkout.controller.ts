import { Body, Controller, Headers, HttpCode, Post } from "@nestjs/common";
import { ApiCheckoutService } from "./api-checkout.service";
import { CheckoutDto } from "./dto/checkout.dto";

@Controller("api/v1/checkout")
export class ApiCheckoutController {
  constructor(private readonly apiCheckoutService: ApiCheckoutService) {}

  @Post()
  @HttpCode(201)
  checkout(@Headers("x-user-id") userId: string, @Body() dto: CheckoutDto) {
    return this.apiCheckoutService.checkout(userId, dto);
  }
}
