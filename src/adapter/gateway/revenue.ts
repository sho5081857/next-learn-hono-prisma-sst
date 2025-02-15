import { PrismaClient } from "@prisma/client";
import { Revenue } from "../../entity/revenue";

export interface RevenueRepository {
  getAll(): Promise<Revenue[]>;
}

export class RevenueRepositoryImpl implements RevenueRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(): Promise<Revenue[]> {
    try {
      const revenues = await this.prisma.revenue.findMany();
      return revenues;
    } catch (error: any) {
      throw new Error(`Failed to fetch revenues: ${error.message}`);
    }
  }
}
