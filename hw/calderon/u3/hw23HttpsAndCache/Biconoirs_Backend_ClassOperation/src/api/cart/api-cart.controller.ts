import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
import { ApiCartService } from "./api-cart.service";
import { ApiAddCartItemDto } from "./dto/api-add-cart-item.dto";

@Controller("api/v1/cart")
export class ApiCartController {
  constructor(private readonly apiCartService: ApiCartService) {}

  @Post("add")
  addItem(@Headers("x-user-id") userId: string, @Body() dto: ApiAddCartItemDto) {
    return this.apiCartService.addItem(userId, dto);
  }

  @Get()
  viewCart(@Headers("x-user-id") userId: string) {
    return this.apiCartService.viewCart(userId);
  }
}
