import type { PrismaClient } from '@prisma/client'
import type { GetAllCustomer, GetFilteredCustomer } from '../../entity/customer'

export interface CustomerRepository {
  getAll(): Promise<GetAllCustomer[]>
  getFiltered(query: string | undefined): Promise<GetFilteredCustomer[]>
  getAllCount(): Promise<number>
}

export class CustomerRepositoryImpl implements CustomerRepository {
  private readonly prisma: PrismaClient
  constructor(prime: PrismaClient) {
    this.prisma = prime
  }

  async getAll(): Promise<GetAllCustomer[]> {
    try {
      const customers: GetAllCustomer[] = await this.prisma.customers.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: 'asc',
        },
      })
      return customers
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch customers: ${error.message}`)
      }
      throw new Error('Failed to fetch customers: An unknown error occurred')
    }
  }

  async getFiltered(query: string): Promise<GetFilteredCustomer[]> {
    try {
      const customers = await this.prisma.$queryRaw<GetFilteredCustomer[]>`
        SELECT customers.id,
               customers.name,
               customers.email,
               customers.image_url AS "image_url",
               COUNT(invoices.id) AS "total_invoices",
               SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS "total_pending",
               SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS "total_paid"
        FROM customers
        LEFT JOIN invoices ON customers.id = invoices.customer_id
        WHERE customers.name ILIKE ${`%${query}%`}
           OR customers.email ILIKE ${`%${query}%`}
        GROUP BY customers.id, customers.name, customers.email, customers.image_url
        ORDER BY customers.name ASC;
      `
      return customers
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch filtered customers: ${error.message}`)
      }
      throw new Error('Failed to fetch filtered customers: An unknown error occurred')
    }
  }

  async getAllCount(): Promise<number> {
    try {
      const count = await this.prisma.customers.count()
      return count
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to count customers: ${error.message}`)
      }
      throw new Error('Failed to count customers: An unknown error occurred')
    }
  }
}
