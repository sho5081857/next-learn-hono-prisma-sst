import type { PrismaClient } from '@prisma/client'
import type { GetAllRevenue } from '../../entity/revenue'

export interface RevenueRepository {
  getAll(): Promise<GetAllRevenue[]>
}

export class RevenueRepositoryImpl implements RevenueRepository {
  private readonly prisma: PrismaClient
  constructor(prime: PrismaClient) {
    this.prisma = prime
  }

  async getAll(): Promise<GetAllRevenue[]> {
    const revenues = await this.prisma.revenue.findMany()
    return revenues
  }
}
