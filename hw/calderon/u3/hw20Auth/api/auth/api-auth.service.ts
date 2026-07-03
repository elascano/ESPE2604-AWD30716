import * as crypto from "crypto";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { SignupDto } from "./dto/signup.dto";
import { ApiLoginDto } from "./dto/api-login.dto";
import { PasswordRecoveryDto } from "./dto/password-recovery.dto";

@Injectable()
export class ApiAuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signup(dto: SignupDto) {
    return this.prisma.user.create({
      data: {
        userId: crypto.randomUUID(),
        name: dto.name,
        email: dto.email,
        passwordHash: dto.password,
        phone: dto.phone,
        preferences: (dto.preferences as object) ?? {},
      },
    });
  }

  async login(dto: ApiLoginDto) {
    return this.prisma.user.findUnique({ where: { email: dto.email } });
  }

  async logout(token: string) {
    return this.prisma.userSession.updateMany({
      where: { refreshToken: token, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  async passwordRecovery(dto: PasswordRecoveryDto) {
    return this.prisma.user.findUnique({ where: { email: dto.email } });
  }
}
