import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

type OrderFilters = {
  status?: string;
  from?: string;
  to?: string;
};

@Injectable()
export class ApiOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, filters: OrderFilters) {
    if (!userId) {
      throw new UnauthorizedException("Missing x-user-id header");
    }

    const user = await this.prisma.user.findUnique({ where: { userId } });
    if (!user) {
      throw new UnauthorizedException("Invalid user");
    }

    const where: Prisma.OrderWhereInput = { userId };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.from || filters.to) {
      where.createdAt = {};
      if (filters.from) {
        where.createdAt.gte = new Date(filters.from);
      }
      if (filters.to) {
        where.createdAt.lte = new Date(filters.to);
      }
    }

    return this.prisma.order.findMany({
      where,
      include: { items: { include: { item: true } } },
      orderBy: { createdAt: "desc" },
    });
  }
}
