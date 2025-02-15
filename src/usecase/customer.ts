import { GetAllCustomer, GetFilteredCustomer } from "../entity/customer";
import { CustomerRepository } from "../adapter/gateway/customer";

export interface CustomerUseCase {
  getAll(): Promise<GetAllCustomer[]>;
  getFiltered(query: string): Promise<GetFilteredCustomer[]>;
  getAllCount(): Promise<number>;
}

export class CustomerUseCaseImpl implements CustomerUseCase {
  private customerRepository: CustomerRepository;

  constructor(customerRepository: CustomerRepository) {
    this.customerRepository = customerRepository;
  }

  async getAll(): Promise<GetAllCustomer[]> {
    return this.customerRepository.getAll();
  }

  async getFiltered(query: string): Promise<GetFilteredCustomer[]> {
    return this.customerRepository.getFiltered(query);
  }

  async getAllCount(): Promise<number> {
    return this.customerRepository.getAllCount();
  }
}

