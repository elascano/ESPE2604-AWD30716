import * as crypto from "crypto";
import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { SignupDto } from "./dto/signup.dto";
import { ApiLoginDto } from "./dto/api-login.dto";
import { PasswordRecoveryDto } from "./dto/password-recovery.dto";
import { hashPassword, comparePasswords, signJwt } from "../../auth/jwt.helper";

@Injectable()
export class ApiAuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException({
        message: "Email already registered",
        data: null,
      });
    }

    const hashedPassword = hashPassword(dto.password);
    const userId = crypto.randomUUID();

    const user = await this.prisma.user.create({
      data: {
        userId,
        name: dto.name,
        email: dto.email,
        passwordHash: hashedPassword,
        phone: dto.phone || null,
        preferences: (dto.preferences as object) ?? {},
      },
    });

    // Create session
    const refreshToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days session expiration

    const session = await this.prisma.userSession.create({
      data: {
        userId: user.userId,
        refreshToken,
        expiresAt,
      },
    });

    const accessToken = signJwt(
      {
        userId: user.userId,
        role: user.role,
        sessionId: Number(session.sessionId),
      },
      3600 // 1 hour token expiration
    );

    return {
      message: "User registered successfully",
      data: {
        accessToken,
        refreshToken,
        expiresIn: 3600,
        user: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    };
  }

  async login(dto: ApiLoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !comparePasswords(dto.password, user.passwordHash)) {
      throw new UnauthorizedException({
        message: "Invalid credentials",
        data: null,
      });
    }

    // Create session
    const refreshToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days session expiration

    const session = await this.prisma.userSession.create({
      data: {
        userId: user.userId,
        refreshToken,
        expiresAt,
      },
    });

    const accessToken = signJwt(
      {
        userId: user.userId,
        role: user.role,
        sessionId: Number(session.sessionId),
      },
      3600 // 1 hour token expiration
    );

    return {
      message: "Login successful",
      data: {
        accessToken,
        refreshToken,
        expiresIn: 3600,
        user: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    };
  }

  async logout(authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException({
        message: "Token not provided or already revoked",
        data: null,
      });
    }

    const parts = authHeader.split(" ");
    const refreshToken = parts.length === 2 && parts[0] === "Bearer" ? parts[1] : authHeader;

    const session = await this.prisma.userSession.findUnique({
      where: { refreshToken },
    });

    if (!session || session.isRevoked) {
      throw new UnauthorizedException({
        message: "Token not provided or already revoked",
        data: null,
      });
    }

    await this.prisma.userSession.update({
      where: { refreshToken },
      data: { isRevoked: true },
    });

    return {
      message: "Logged out successfully",
      data: {
        revokedSessions: 1,
      },
    };
  }

  async passwordRecovery(dto: PasswordRecoveryDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new NotFoundException({
        message: "No account found with that email",
        data: null,
      });
    }
    return {
      message: "If the email is registered, you will receive a recovery link",
      data: null,
    };
  }
}

