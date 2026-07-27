import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ApiAddCartItemDto } from "./dto/api-add-cart-item.dto";

@Injectable()
export class ApiCartService {
  constructor(private readonly prisma: PrismaService) {}

  async viewCart(userId: string) {
    await this.requireUser(userId);

    const cart = await this.prisma.shoppingCart.findUnique({
      where: { userId },
      include: { items: { include: { item: true } } },
    });

    if (!cart) {
      return { userId, items: [], total: 0 };
    }

    return {
      ...cart,
      total: cart.items.reduce((sum, cartItem) => {
        return sum + Number(cartItem.item.price) * cartItem.quantity;
      }, 0),
    };
  }

  async addItem(userId: string, dto: ApiAddCartItemDto) {
    await this.requireUser(userId);

    if (!dto.dish_id) {
      throw new BadRequestException("dish_id is required");
    }

    if (typeof dto.quantity !== "number" || !Number.isInteger(dto.quantity) || dto.quantity < 1) {
      throw new BadRequestException("Quantity must be an integer greater than zero");
    }

    const dish = await this.prisma.menuItem.findUnique({ where: { itemId: dto.dish_id } });
    if (!dish) {
      throw new NotFoundException("Dish not found");
    }

    await this.prisma.shoppingCart.upsert({
      where: { userId },
      create: { userId },
      update: { updatedAt: new Date() },
    });

    await this.prisma.shoppingCartItem.upsert({
      where: { userId_itemId: { userId, itemId: dto.dish_id } },
      create: { userId, itemId: dto.dish_id, quantity: dto.quantity },
      update: { quantity: { increment: dto.quantity } },
    });

    return this.viewCart(userId);
  }

  private async requireUser(userId?: string) {
    if (!userId) {
      throw new UnauthorizedException("Missing x-user-id header");
    }

    const user = await this.prisma.user.findUnique({
      where: { userId },
      select: { userId: true },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid user");
    }
  }
}
