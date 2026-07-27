import * as crypto from "crypto";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { AdminCreateInventoryDto } from "./dto/admin-create-inventory.dto";
import { AdminUpdateInventoryDto } from "./dto/admin-update-inventory.dto";

type AnalyticsFilters = {
  from?: string;
  to?: string;
};

@Injectable()
export class ApiAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllInventory(userId: string) {
    await this.requireAdmin(userId);
    return this.prisma.inventory.findMany({ include: { ingredient: true } });
  }

  async createInventory(userId: string, dto: AdminCreateInventoryDto) {
    await this.requireAdmin(userId);

    if (!dto.ingredient_name || !dto.unit) {
      throw new BadRequestException("ingredient_name and unit are required");
    }

    this.validateNonNegativeNumber(dto.current_stock, "current_stock");
    this.validateNonNegativeNumber(dto.reorder_level, "reorder_level");
    this.validateNonNegativeNumber(dto.unit_cost, "unit_cost");
    this.validateDate(dto.expiry_date);

    try {
      return await this.prisma.inventory.create({
        data: {
          inventoryId: crypto.randomUUID(),
          currentStock: dto.current_stock,
          reorderLevel: dto.reorder_level,
          supplier: dto.supplier,
          expiryDate: dto.expiry_date ? new Date(dto.expiry_date) : null,
          ingredient: {
            create: {
              skuCode: crypto.randomUUID(),
              name: dto.ingredient_name,
              unitOfMeasurement: dto.unit,
              unitCost: dto.unit_cost,
            },
          },
        },
        include: { ingredient: true },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateInventory(userId: string, inventoryId: string, dto: AdminUpdateInventoryDto) {
    await this.requireAdmin(userId);

    if (Object.keys(dto).length === 0) {
      throw new BadRequestException("At least one field is required");
    }

    const existing = await this.prisma.inventory.findUnique({ where: { inventoryId } });
    if (!existing) {
      throw new NotFoundException("Inventory item not found");
    }

    if (dto.current_stock !== undefined) {
      this.validateNonNegativeNumber(dto.current_stock, "current_stock");
    }

    if (dto.reorder_level !== undefined) {
      this.validateNonNegativeNumber(dto.reorder_level, "reorder_level");
    }

    this.validateDate(dto.expiry_date);

    try {
      return await this.prisma.inventory.update({
        where: { inventoryId },
        data: {
          currentStock: dto.current_stock,
          reorderLevel: dto.reorder_level,
          expiryDate: dto.expiry_date ? new Date(dto.expiry_date) : undefined,
          updatedAt: new Date(),
        },
        include: { ingredient: true },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async removeInventory(userId: string, inventoryId: string) {
    await this.requireAdmin(userId);

    const existing = await this.prisma.inventory.findUnique({ where: { inventoryId } });
    if (!existing) {
      throw new NotFoundException("Inventory item not found");
    }

    try {
      await this.prisma.inventory.delete({ where: { inventoryId } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
        throw new ConflictException("Inventory item is currently in use");
      }
      throw error;
    }
  }

  async getAnalytics(userId: string, filters: AnalyticsFilters) {
    await this.requireAdmin(userId);

    const dateFilter: Prisma.DateTimeFilter = {};
    if (filters.from) dateFilter.gte = new Date(filters.from);
    if (filters.to) dateFilter.lte = new Date(filters.to);

    const where = filters.from || filters.to ? { createdAt: dateFilter } : {};

    const [totalOrders, totalRevenue, totalReservations, allInventory] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.aggregate({ _sum: { totalAmount: true }, where }),
      this.prisma.reservation.count(),
      this.prisma.inventory.findMany({ include: { ingredient: true } }),
    ]);

    const lowStockItems = allInventory.filter(
      (item) => Number(item.currentStock) <= Number(item.reorderLevel),
    );

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount ?? 0,
      totalReservations,
      lowStockCount: lowStockItems.length,
      lowStockItems,
    };
  }

  private async requireAdmin(userId?: string) {
    if (!userId) {
      throw new UnauthorizedException("Missing x-user-id header");
    }

    const user = await this.prisma.user.findUnique({
      where: { userId },
      select: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid user");
    }

    if (user.role !== "admin") {
      throw new ForbiddenException("Admin role required");
    }
  }

  private validateNonNegativeNumber(value: number | undefined, field: string) {
    if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
      throw new UnprocessableEntityException(`${field} must be a non-negative number`);
    }
  }

  private validateDate(value?: string) {
    if (value && Number.isNaN(new Date(value).getTime())) {
      throw new UnprocessableEntityException("expiry_date must be a valid date");
    }
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002" || error.code === "P2003") {
        throw new UnprocessableEntityException("Inventory data cannot be processed");
      }
    }
    throw error;
  }
}
