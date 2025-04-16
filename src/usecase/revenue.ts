import type { RevenueRepository } from '../adapter/gateway/revenue'

export interface GetAllRevenueDto {
  month: string
  revenue: number
}

export interface RevenueUseCase {
  getAll(): Promise<GetAllRevenueDto[]>
}

export class RevenueUseCaseImpl implements RevenueUseCase {
  private readonly revenueRepository: RevenueRepository
  constructor(revenueRepository: RevenueRepository) {
    this.revenueRepository = revenueRepository
  }

  async getAll(): Promise<GetAllRevenueDto[]> {
    const revenues = await this.revenueRepository.getAll()
    const revenueList: GetAllRevenueDto[] = revenues.map((item) => {
      return {
        month: item.month,
        revenue: item.revenue,
      }
    })
    return revenueList
  }
}
