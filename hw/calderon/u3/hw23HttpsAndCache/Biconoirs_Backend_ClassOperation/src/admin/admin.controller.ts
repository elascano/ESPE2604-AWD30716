import { Controller, Get, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("admin")
@UseGuards(AuthGuard)
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("stats")
  async getStats() {
    const totalOrders = await this.prisma.order.count();
    
    const revenueAgg = await this.prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: "cancelled" } }
    });
    
    const pendingOrders = await this.prisma.order.count({
      where: { status: "pending" }
    });
    
    const totalCustomers = await this.prisma.user.count({
      where: { role: "customer" }
    });

    return {
      totalOrders,
      totalRevenue: Number(revenueAgg._sum.totalAmount || 0),
      pendingOrders,
      totalCustomers
    };
  }
}
