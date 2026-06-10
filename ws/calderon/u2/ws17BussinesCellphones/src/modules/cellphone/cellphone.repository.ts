import { prisma } from "@/lib/prisma";

export class CellphoneRepository {

  async create(data: any) {
    return prisma.cellphone.create({
      data
    });
  }

  async findAll() {
    return prisma.cellphone.findMany();
  }

  async findById(id: string) {
    return prisma.cellphone.findUnique({
      where: { id }
    });
  }

  async update(id: string, data: any) {
    return prisma.cellphone.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return prisma.cellphone.delete({
      where: { id }
    });
  }
}