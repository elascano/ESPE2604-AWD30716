import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class ApiProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    if (!userId) {
      throw new UnauthorizedException("Missing x-user-id header");
    }

    const user = await this.prisma.user.findUnique({
      where: { userId },
      select: { userId: true, name: true, email: true, phone: true, role: true, preferences: true, createdAt: true },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async update(userId: string, dto: UpdateProfileDto) {
    if (!userId) {
      throw new UnauthorizedException("Missing x-user-id header");
    }

    const existing = await this.prisma.user.findUnique({ where: { userId } });

    if (!existing) {
      throw new NotFoundException("User not found");
    }

    const data: Prisma.UserUpdateInput = {};

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.preferences !== undefined) data.preferences = dto.preferences as Prisma.InputJsonValue;

    return this.prisma.user.update({ where: { userId }, data });
  }
}
