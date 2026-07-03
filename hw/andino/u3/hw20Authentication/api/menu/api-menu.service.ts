import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

type MenuFilters = {
  category?: string;
  search?: string;
  available?: string;
  page?: string;
  perPage?: string;
};

@Injectable()
export class ApiMenuService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: MenuFilters) {
    const where: Prisma.MenuItemWhereInput = {};

    if (filters.available === "true") {
      where.isAvailable = true;
    }

    if (filters.search) {
      where.name = { contains: filters.search, mode: "insensitive" };
    }

    if (filters.category) {
      where.category = { name: { equals: filters.category, mode: "insensitive" } };
    }

    const page = parseInt(filters.page ?? "1", 10);
    const perPage = parseInt(filters.perPage ?? "20", 10);
    const skip = (page - 1) * perPage;

    return this.prisma.menuItem.findMany({
      where,
      include: { category: true },
      orderBy: { name: "asc" },
      skip,
      take: perPage,
    });
  }

  async findOne(dishId: string) {
    const dish = await this.prisma.menuItem.findUnique({
      where: { itemId: dishId },
      include: { category: true, ingredients: { include: { ingredient: true } } },
    });

    if (!dish) {
      throw new NotFoundException("Dish not found");
    }

    return dish;
  }
}
