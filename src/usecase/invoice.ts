import { CreateInvoiceRequest, UpdateInvoiceRequest } from "../adapter/controller/presenter/invoice/request/invoice-request";
import { InvoiceRepository } from "../adapter/gateway/invoice";
import {
  GetFilteredInvoice,
  GetInvoiceById,
  GetLatestInvoice,
  Invoice,
} from "../entity/invoice";

export interface InvoiceUseCase {
  getLatest(): Promise<GetLatestInvoice[]>
  getFiltered(
    query: string,
    offset: number,
    limit: number
  ): Promise<{
    invoices: GetFilteredInvoice[]
    totalCount: number
  }>
  getPages(query: string): Promise<number>
  getAllCount(): Promise<number>
  getStatusCount(): Promise<{
    paid: number
    pending: number
  }>
  getById(id: string): Promise<GetInvoiceById | null>
  create(invoice: CreateInvoiceRequest): Promise<Invoice>
  update(id: string, invoice: UpdateInvoiceRequest): Promise<Invoice | null>
  delete(id: string): Promise<void>
}

export class InvoiceUseCaseImpl implements InvoiceUseCase {
  private invoiceRepository: InvoiceRepository

  constructor(invoiceRepository: InvoiceRepository) {
    this.invoiceRepository = invoiceRepository
  }

  async getLatest(): Promise<GetLatestInvoice[]> {
    return this.invoiceRepository.getLatest()
  }

  async getFiltered(
    query: string,
    offset: number,
    limit: number
  ): Promise<{
    invoices: GetFilteredInvoice[]
    totalCount: number
  }> {
    return this.invoiceRepository.getFiltered(query, offset, limit)
  }

  async getPages(query: string): Promise<number> {
    return this.invoiceRepository.getPages(query)
  }

  async getAllCount(): Promise<number> {
    return this.invoiceRepository.getAllCount()
  }

  async getStatusCount(): Promise<{ paid: number; pending: number }> {
    return this.invoiceRepository.getStatusCount()
  }

  async getById(id: string): Promise<GetInvoiceById | null> {
    return this.invoiceRepository.getById(id)
  }

  async create(invoice: CreateInvoiceRequest): Promise<Invoice> {
    return this.invoiceRepository.create(invoice)
  }

  async update(id: string, invoice: UpdateInvoiceRequest): Promise<Invoice | null> {
    return this.invoiceRepository.update(id, invoice)
  }

  async delete(id: string): Promise<void> {
    return this.invoiceRepository.delete(id)
  }
}
