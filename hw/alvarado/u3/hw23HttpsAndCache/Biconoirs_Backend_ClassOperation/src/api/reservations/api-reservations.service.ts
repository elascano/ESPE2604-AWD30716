import * as crypto from "crypto";
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";

@Injectable()
export class ApiReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateReservationDto) {
    await this.requireUser(userId);

    return this.prisma.reservation.create({
      data: {
        reservationId: crypto.randomUUID(),
        userId,
        reservationDate: new Date(dto.reservation_date),
        reservationTime: new Date(`1970-01-01T${dto.reservation_time}:00Z`),
        partySize: dto.party_size,
        specialRequests: dto.special_requests,
        status: "pending",
      },
    });
  }

  async findAll(userId: string) {
    await this.requireUser(userId);

    return this.prisma.reservation.findMany({
      where: { userId },
      orderBy: { reservationDate: "asc" },
    });
  }

  async update(userId: string, reservationId: string, dto: UpdateReservationDto) {
    await this.requireUser(userId);

    if (Object.keys(dto).length === 0) {
      throw new BadRequestException("At least one field is required");
    }

    const existing = await this.prisma.reservation.findUnique({ where: { reservationId } });

    if (!existing) {
      throw new NotFoundException("Reservation not found");
    }

    if (existing.userId !== userId) {
      throw new ForbiddenException("Access denied");
    }

    const data: Record<string, unknown> = {};

    if (dto.reservation_time !== undefined) {
      data.reservationTime = new Date(`1970-01-01T${dto.reservation_time}:00Z`);
    }

    if (dto.party_size !== undefined) {
      data.partySize = dto.party_size;
    }

    return this.prisma.reservation.update({ where: { reservationId }, data });
  }

  async remove(userId: string, reservationId: string) {
    await this.requireUser(userId);

    const existing = await this.prisma.reservation.findUnique({ where: { reservationId } });

    if (!existing) {
      throw new NotFoundException("Reservation not found");
    }

    if (existing.userId !== userId) {
      throw new ForbiddenException("Access denied");
    }

    await this.prisma.reservation.delete({ where: { reservationId } });
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
