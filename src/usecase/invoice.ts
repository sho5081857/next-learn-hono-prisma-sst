import type { InvoiceRepository } from '../adapter/gateway/invoice'
import type { CreateInvoice, GetFilteredInvoice, UpdateInvoice } from '../entity/invoice'

export interface GetLatestInvoiceDto {
  id: string
  name: string
  image_url: string
  email: string
  amount: number
}

export interface GetFilteredInvoiceDto {
  id: string
  customer_id: string
  name: string
  email: string
  image_url: string
  date: string
  amount: number
  status: 'pending' | 'paid'
}

export interface GetInvoiceByIdDto {
  id: string
  customer_id: string
  amount: number
  status: 'pending' | 'paid'
}

export interface GetInvoiceDto {
  id: string
  customer_id: string
  amount: number
  date: string
  status: 'pending' | 'paid'
}

export interface CreateInvoiceInputDto {
  customer_id: string
  amount: number
  status: 'pending' | 'paid'
}

export interface UpdateInvoiceInputDto {
  id: string
  customer_id: string
  amount: number
  status: 'pending' | 'paid'
}

export interface InvoiceUseCase {
  getLatest(): Promise<GetLatestInvoiceDto[]>
  getFiltered(
    query: string,
    offset: number,
    limit: number
  ): Promise<{
    invoices: GetFilteredInvoiceDto[]
    totalCount: number
  }>
  getPages(query: string): Promise<number>
  getAllCount(): Promise<number>
  getStatusCount(): Promise<{
    paid: number
    pending: number
  }>
  getById(id: string): Promise<GetInvoiceByIdDto | null>
  create(invoice: CreateInvoiceInputDto): Promise<GetInvoiceDto>
  update(invoice: UpdateInvoiceInputDto): Promise<GetInvoiceDto | null>
  delete(id: string): Promise<void>
}

export class InvoiceUseCaseImpl implements InvoiceUseCase {
  private readonly invoiceRepository: InvoiceRepository
  constructor(invoiceRepository: InvoiceRepository) {
    this.invoiceRepository = invoiceRepository
  }

  async getLatest(): Promise<GetLatestInvoiceDto[]> {
    return await this.invoiceRepository.getLatest()
  }

  async getFiltered(
    query: string,
    offset: number,
    limit: number
  ): Promise<{
    invoices: GetFilteredInvoiceDto[]
    totalCount: number
  }> {
    const invoices = await this.invoiceRepository.getFiltered(query, offset, limit)
    const totalCount = await this.invoiceRepository.getFilteredAllCount(query)
    const invoiceList: GetFilteredInvoiceDto[] = invoices.map((invoice: GetFilteredInvoice) => ({
      id: invoice.id,
      customer_id: invoice.customer_id,
      name: invoice.name,
      email: invoice.email,
      image_url: invoice.image_url,
      date: invoice.date,
      amount: invoice.amount,
      status: invoice.status,
    }))
    return {
      invoices: invoiceList,
      totalCount: totalCount,
    }
  }

  async getPages(query: string): Promise<number> {
    return await this.invoiceRepository.getPages(query)
  }

  async getAllCount(): Promise<number> {
    return await this.invoiceRepository.getAllCount()
  }

  async getStatusCount(): Promise<{ paid: number; pending: number }> {
    return await this.invoiceRepository.getStatusCount()
  }

  async getById(id: string): Promise<GetInvoiceByIdDto | null> {
    const invoice = await this.invoiceRepository.getById(id)
    if (!invoice) {
      return null
    }
    const invoiceData: GetInvoiceByIdDto = {
      id: invoice.id,
      customer_id: invoice.customer_id,
      amount: invoice.amount,
      status: invoice.status,
    }
    return invoiceData
  }

  async create(invoice: CreateInvoiceInputDto): Promise<GetInvoiceDto> {
    const createInvoice: CreateInvoice = {
      customer_id: invoice.customer_id,
      amount: invoice.amount,
      status: invoice.status,
    }
    const createdInvoice = await this.invoiceRepository.create(createInvoice)
    const invoiceData: GetInvoiceDto = {
      id: createdInvoice.id,
      customer_id: createdInvoice.customer_id,
      amount: createdInvoice.amount,
      date: createdInvoice.date,
      status: createdInvoice.status,
    }
    return invoiceData
  }

  async update(invoice: UpdateInvoiceInputDto): Promise<GetInvoiceDto | null> {
    const existingInvoice = await this.invoiceRepository.getById(invoice.id)
    if (!existingInvoice) {
      throw new Error('Invoice not found')
    }
    const updateInvoice: UpdateInvoice = {
      id: existingInvoice.id,
      customer_id: invoice.customer_id,
      amount: invoice.amount,
      status: invoice.status,
    }

    const updatedInvoice = await this.invoiceRepository.update(updateInvoice)

    if (!updatedInvoice) {
      throw new Error('Invoice update failed')
    }

    const invoiceData: GetInvoiceDto = {
      id: updatedInvoice.id,
      customer_id: updatedInvoice.customer_id,
      amount: updatedInvoice.amount,
      date: updatedInvoice.date,
      status: updatedInvoice.status,
    }

    return invoiceData
  }

  async delete(id: string): Promise<void> {
    return await this.invoiceRepository.delete(id)
  }
}
