import type { Context } from 'hono'
import { apiVersion } from '../../../api/constants'
import { newErrorResponse } from '../presenter/response'
import type { RevenueUseCase } from '../../../usecase/revenue'
import { newGetAllRevenueListResponse } from '../presenter/revenue/response/getAllRevenueList'

export class RevenueHandler {
  private readonly revenueUseCase: RevenueUseCase
  constructor(revenueUseCase: RevenueUseCase) {
    this.revenueUseCase = revenueUseCase
  }
  async getAllRevenueList(c: Context): Promise<Response> {
    try {
      const revenueList = await this.revenueUseCase.getAll()

      return c.json(newGetAllRevenueListResponse(apiVersion, revenueList), 200)
    } catch (err: any) {
      // log.error(err.message);
      return c.json(newErrorResponse(400, err.message))
    }
  }
}
