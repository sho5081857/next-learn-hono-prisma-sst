import type { PrismaClient } from '@prisma/client'
import type {
  CreateInvoice,
  GetFilteredInvoice,
  GetInvoice,
  GetInvoiceById,
  GetLatestInvoice,
  UpdateInvoice,
} from '../../entity/invoice'

export interface InvoiceRepository {
  getLatest(): Promise<GetLatestInvoice[]>
  getFiltered(query: string, offset: number, limit: number): Promise<GetFilteredInvoice[]>
  getFilteredAllCount(query: string): Promise<number>
  getPages(query: string): Promise<number>
  getAllCount(): Promise<number>
  getStatusCount(): Promise<{ paid: number; pending: number }>
  getById(id: string): Promise<GetInvoiceById | null>
  create(invoice: CreateInvoice): Promise<GetInvoice>
  update(invoice: UpdateInvoice): Promise<GetInvoice | null>
  delete(id: string): Promise<void>
}

export class InvoiceRepositoryImpl implements InvoiceRepository {
  private readonly prisma: PrismaClient
  constructor(prime: PrismaClient) {
    this.prisma = prime
  }

  async getLatest(): Promise<GetLatestInvoice[]> {
    const invoices = await this.prisma.invoices.findMany({
      take: 5,
      orderBy: {
        date: 'desc',
      },
      include: {
        customers: {
          select: {
            name: true,
            image_url: true,
            email: true,
          },
        },
      },
    })

    return invoices.map((invoice) => ({
      id: invoice.id,
      name: invoice.customers.name,
      image_url: invoice.customers.image_url,
      email: invoice.customers.email,
      amount: invoice.amount,
    }))
  }

  async getFiltered(query: string, offset: number, limit: number): Promise<GetFilteredInvoice[]> {
    const invoices = await this.prisma.$queryRaw<GetFilteredInvoice[]>`
      SELECT invoices.id,
            invoices.customer_id,
            invoices.amount,
            invoices.date,
            invoices.status,
            customers.name,
            customers.email,
            customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    return invoices
  }

  async getFilteredAllCount(query: string): Promise<number> {
    const totalCountResult = await this.prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*)
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
    `
    const totalCount = Number(totalCountResult[0].count)

    return totalCount
  }

  async getPages(query: string): Promise<number> {
    const countResult = await this.prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*)
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
    `
    const count = Number(countResult[0].count)
    return count
  }

  async getAllCount(): Promise<number> {
    return await this.prisma.invoices.count()
  }

  async getStatusCount(): Promise<{ paid: number; pending: number }> {
    const result = await this.prisma.invoices.groupBy({
      by: ['status'],
      _sum: {
        amount: true,
      },
    })

    const paid = result.find((r) => r.status === 'paid')?._sum.amount || 0
    const pending = result.find((r) => r.status === 'pending')?._sum.amount || 0

    return { paid, pending }
  }

  async getById(id: string): Promise<GetInvoiceById | null> {
    const invoice = await this.prisma.invoices.findUnique({
      where: { id },
      select: {
        id: true,
        customer_id: true,
        amount: true,
        status: true,
      },
    })

    if (!invoice) {
      return null
    }

    return {
      id: invoice.id,
      customer_id: invoice.customer_id,
      amount: invoice.amount,
      status: invoice.status as 'pending' | 'paid',
    }
  }

  async create(invoice: CreateInvoice): Promise<GetInvoice> {
    const createdInvoice = await this.prisma.invoices.create({
      data: {
        customer_id: invoice.customer_id,
        amount: invoice.amount,
        date: new Date(),
        status: invoice.status,
      },
    })

    return {
      id: createdInvoice.id,
      customer_id: createdInvoice.customer_id,
      amount: createdInvoice.amount,
      date: createdInvoice.date.toISOString(),
      status: createdInvoice.status as 'pending' | 'paid',
    }
  }

  async update(invoice: UpdateInvoice): Promise<GetInvoice | null> {
    const updatedInvoice = await this.prisma.invoices.update({
      where: { id: invoice.id },
      data: invoice,
    })

    return {
      id: updatedInvoice.id,
      customer_id: updatedInvoice.customer_id,
      amount: updatedInvoice.amount,
      date: updatedInvoice.date.toISOString(),
      status: updatedInvoice.status as 'pending' | 'paid',
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.invoices.delete({
      where: { id },
    })
  }
}
