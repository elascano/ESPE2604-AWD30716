import * as crypto from "crypto";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CheckoutDto } from "./dto/checkout.dto";

@Injectable()
export class ApiCheckoutService {
  constructor(private readonly prisma: PrismaService) {}

  async checkout(userId: string, dto: CheckoutDto) {
    if (!userId) {
      throw new UnauthorizedException("Missing x-user-id header");
    }

    const user = await this.prisma.user.findUnique({ where: { userId } });
    if (!user) {
      throw new UnauthorizedException("Invalid user");
    }

    const cart = await this.prisma.shoppingCart.findUnique({
      where: { userId },
      include: { items: { include: { item: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException("Cart is empty");
    }

    const totalAmount = cart.items.reduce((sum, cartItem) => {
      return sum + Number(cartItem.item.price) * cartItem.quantity;
    }, 0);

    const order = await this.prisma.order.create({
      data: {
        orderId: crypto.randomUUID(),
        userId,
        totalAmount,
        status: "pending",
        deliveryType: dto.delivery_type,
        deliveryAddress: dto.delivery_address,
        specialInstructions: dto.special_instructions,
        items: {
          create: cart.items.map((cartItem) => ({
            itemId: cartItem.itemId,
            quantity: cartItem.quantity,
            priceAtPurchase: cartItem.item.price,
          })),
        },
      },
      include: { items: true },
    });

    await this.prisma.shoppingCartItem.deleteMany({ where: { userId } });
    await this.prisma.shoppingCart.deleteMany({ where: { userId } });

    return order;
  }
}
