import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { verifyJwt } from "./jwt.helper";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException({
        message: "Unauthorized — invalid, expired, or missing token",
        data: null,
      });
    }

    const [type, token] = authHeader.split(" ");
    if (type !== "Bearer" || !token) {
      throw new UnauthorizedException({
        message: "Unauthorized — invalid, expired, or missing token",
        data: null,
      });
    }

    const payload = verifyJwt(token);
    if (!payload) {
      throw new UnauthorizedException({
        message: "Unauthorized — invalid, expired, or missing token",
        data: null,
      });
    }

    // Check if session is active in database
    if (payload.sessionId) {
      try {
        const session = await this.prisma.userSession.findUnique({
          where: { sessionId: BigInt(payload.sessionId) },
        });

        if (!session || session.isRevoked || new Date() > session.expiresAt) {
          throw new UnauthorizedException({
            message: "Unauthorized — invalid, expired, or missing token",
            data: null,
          });
        }
      } catch (e) {
        throw new UnauthorizedException({
          message: "Unauthorized — invalid, expired, or missing token",
          data: null,
        });
      }
    }

    // Attach user to request
    request["user"] = payload;

    // Inject the x-user-id header dynamically so existing controllers
    // reading @Headers("x-user-id") work transparently.
    request.headers["x-user-id"] = payload.userId;

    return true;
  }
}
