import type { CustomerRepository } from '../adapter/gateway/customer'

export interface GetAllCustomerDto {
  id: string
  name: string
}

export interface GetFilteredCustomerDto {
  id: string
  name: string
  email: string
  image_url: string
  total_invoices: number
  total_pending: number
  total_paid: number
}

export interface CustomerUseCase {
  getAll(): Promise<GetAllCustomerDto[]>
  getFiltered(query: string): Promise<GetFilteredCustomerDto[]>
  getAllCount(): Promise<number>
}

export class CustomerUseCaseImpl implements CustomerUseCase {
  private readonly customerRepository: CustomerRepository
  constructor(customerRepository: CustomerRepository) {
    this.customerRepository = customerRepository
  }

  async getAll(): Promise<GetAllCustomerDto[]> {
    const customers = await this.customerRepository.getAll()
    const customerList: GetAllCustomerDto[] = customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
    }))
    return customerList
  }

  async getFiltered(query: string): Promise<GetFilteredCustomerDto[]> {
    const customers = await this.customerRepository.getFiltered(query)
    const customerList: GetFilteredCustomerDto[] = customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      image_url: customer.image_url,
      total_invoices: Number(customer.total_invoices),
      total_pending: Number(customer.total_pending),
      total_paid: Number(customer.total_paid),
    }))
    return customerList
  }

  async getAllCount(): Promise<number> {
    return await this.customerRepository.getAllCount()
  }
}
