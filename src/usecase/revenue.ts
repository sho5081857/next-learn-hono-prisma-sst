import { Revenue } from "../entity/revenue";
import { RevenueRepository } from "../adapter/gateway/revenue";

export interface RevenueUseCase {
  getAll(): Promise<Revenue[]>;
}

export class RevenueUseCaseImpl implements RevenueUseCase {
  private revenueRepository: RevenueRepository;

  constructor(revenueRepository: RevenueRepository) {
    this.revenueRepository = revenueRepository;
  }

  async getAll(): Promise<Revenue[]> {
    return this.revenueRepository.getAll();
  }
}
