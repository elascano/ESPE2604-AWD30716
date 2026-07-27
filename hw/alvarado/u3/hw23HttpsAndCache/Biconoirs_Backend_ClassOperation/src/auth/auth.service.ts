import * as crypto from "crypto";
import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { hashPassword, comparePasswords, signJwt } from "./jwt.helper";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException({
        message: "Email already registered",
        data: null,
      });
    }

    const hashedPassword = hashPassword(dto.passwordHash);
    const userId = crypto.randomUUID();

    const user = await this.prisma.user.create({
      data: {
        userId,
        name: dto.name,
        email: dto.email,
        passwordHash: hashedPassword,
        phone: dto.phone || null,
        preferences: {},
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

  async login(dto: LoginDto) {
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

  async refresh(dto: RefreshDto) {
    const session = await this.prisma.userSession.findUnique({
      where: { refreshToken: dto.refreshToken },
      include: { user: true },
    });

    if (!session || session.isRevoked || new Date() > session.expiresAt) {
      throw new UnauthorizedException({
        message: "Invalid or revoked refresh token",
        data: null,
      });
    }

    const accessToken = signJwt(
      {
        userId: session.userId,
        role: session.user.role,
        sessionId: Number(session.sessionId),
      },
      3600 // 1 hour token expiration
    );

    return {
      message: "Token refreshed successfully",
      data: {
        accessToken,
        expiresIn: 3600,
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

  async getMe(userId: string) {
    if (!userId) {
      throw new UnauthorizedException({
        message: "Unauthorized — x-user-id header is required",
        data: null,
      });
    }

    const user = await this.prisma.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        preferences: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException({
        message: "User not found",
        data: null,
      });
    }

    return {
      message: "Profile retrieved successfully",
      data: user,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
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

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: dto.token,
        passwordResetExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: "Invalid or expired token",
        data: null,
      });
    }

    const hashedPassword = hashPassword(dto.newPassword);

    const updatedUser = await this.prisma.user.update({
      where: { userId: user.userId },
      data: {
        passwordHash: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiresAt: null,
      },
    });

    return {
      message: "Password updated successfully",
      data: {
        userId: updatedUser.userId,
        email: updatedUser.email,
      },
    };
  }
}

