import { prisma } from '../config/database';

export class UserService {
  public async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        ruc: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  public async getUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        ruc: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });
  }

  public async getUserByRuc(ruc: string) {
    return prisma.user.findUnique({
      where: { ruc },
    });
  }

  public async getLoginUser(identifier: string) {
    return prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { ruc: identifier }
        ]
      }
    });
  }

  public async createUser(data: any) {
    return prisma.user.create({
      data,
    });
  }
}
