import { Context } from "hono";
import { apiVersion } from "../../../api/constants";
import { newErrorResponse } from "../presenter/response";
import { RevenueUseCase } from "../../../usecase/revenue";
import { newGetAllRevenueListResponse } from "../presenter/revenue";

export class RevenueHandler {
  private revenueUseCase: RevenueUseCase;
  constructor(revenueUseCase: RevenueUseCase) {
    this.revenueUseCase = revenueUseCase;
  }
  async getAllRevenueList(c: Context) {
    try {
      const revenues = await this.revenueUseCase.getAll();

      const revenueList = revenues.map((v) => ({
        month: v.month,
        revenue: v.revenue,
      }));

      return c.json(newGetAllRevenueListResponse(apiVersion, revenueList), 200);
    } catch (err: any) {
      //   log.error(err.message);
      return c.json(newErrorResponse(400, err.message));
    }
  }
}
