import type { Context } from 'hono'
import { apiVersion } from '../../../api/constants'
import type {
  CreateInvoiceInputDto,
  InvoiceUseCase,
  UpdateInvoiceInputDto,
} from '../../../usecase/invoice'
import type { CreateInvoiceRequest } from '../presenter/invoice/request/createInvoice'
import type { UpdateInvoiceRequest } from '../presenter/invoice/request/updateInvoice'
import { newGetAllCountResponse } from '../presenter/invoice/response/getAllCount'
import { newGetAllInvoicesStatusCountResponse } from '../presenter/invoice/response/getAllInvoicesStatusCount'
import { newGetFilteredInvoiceListResponse } from '../presenter/invoice/response/getFilteredInvoiceList'
import { newGetInvoiceByIdResponse } from '../presenter/invoice/response/getInvoiceById'
import { newGetLatestInvoiceListResponse } from '../presenter/invoice/response/getLatestInvoiceList'
import { newGetPagesResponse } from '../presenter/invoice/response/getPages'
import { newErrorResponse } from '../presenter/response'
import { newInvoiceResponse } from '../presenter/invoice/response/Invoice'
// import { log } from '../../../logger';

export class InvoiceHandler {
  private readonly invoiceUseCase: InvoiceUseCase
  constructor(invoiceUseCase: InvoiceUseCase) {
    this.invoiceUseCase = invoiceUseCase
  }

  async getLatestInvoicesList(c: Context) {
    try {
      const invoices = await this.invoiceUseCase.getLatest()
      const invoiceList = invoices.map((v) => ({
        id: v.id,
        email: v.email,
        name: v.name,
        image_url: v.image_url,
        amount: v.amount,
      }))

      return c.json(newGetLatestInvoiceListResponse(apiVersion, invoiceList), 200)
    } catch (err: any) {
      //   log.error(err.message);
      return c.json(newErrorResponse(400, err.message))
    }
  }

  async getFilteredInvoicesList(c: Context) {
    const query = c.req.query('query') ?? ''
    const offset = c.req.query('offset') ?? '1'
    const limit = c.req.query('limit') ?? '6'
    try {
      const { invoices, totalCount } = await this.invoiceUseCase.getFiltered(
        query,
        Number.parseInt(offset),
        Number.parseInt(limit)
      )

      const invoiceList = invoices.map((v) => ({
        id: v.id,
        customer_id: v.customer_id,
        email: v.email,
        name: v.name,
        image_url: v.image_url,
        date: v.date,
        amount: v.amount,
        status: v.status,
      }))

      return c.json(newGetFilteredInvoiceListResponse(apiVersion, invoiceList, totalCount), 200)
    } catch (err: any) {
      //   log.error(err.message);
      return c.json(newErrorResponse(400, err.message))
    }
  }

  async getInvoicesPages(c: Context) {
    const query = c.req.query('query') ?? ''

    try {
      const count = await this.invoiceUseCase.getPages(query)
      return c.json(newGetPagesResponse(apiVersion, count), 200)
    } catch (err: any) {
      //   log.error(err.message);
      return c.json(newErrorResponse(400, err.message))
    }
  }

  async getAllInvoicesCount(c: Context) {
    try {
      const count = await this.invoiceUseCase.getAllCount()
      return c.json(newGetAllCountResponse(apiVersion, count))
    } catch (err: any) {
      //   log.error(err.message);
      return c.json(newErrorResponse(400, err.message))
    }
  }

  async getAllInvoicesStatusCount(c: Context) {
    try {
      const counts = await this.invoiceUseCase.getStatusCount()
      return c.json(newGetAllInvoicesStatusCountResponse(apiVersion, counts))
    } catch (err: any) {
      return c.json({ error: err.message }, 400)
    }
  }

  async getInvoiceById(c: Context) {
    const { id } = c.req.param()
    try {
      const invoice = await this.invoiceUseCase.getById(id)
      if (!invoice) {
        return c.json(newErrorResponse(404, 'Invoice not found'))
      }

      return c.json(newGetInvoiceByIdResponse(apiVersion, invoice), 200)
    } catch (err: any) {
      //   log.error(err.message);
      return c.json(newErrorResponse(400, err.message))
    }
  }

  async createInvoice(c: Context, req: CreateInvoiceRequest) {
    try {
      const invoice: CreateInvoiceInputDto = {
        customer_id: req.customer_id,
        amount: req.amount,
        status: req.status,
      }
      const createdInvoice = await this.invoiceUseCase.create(invoice)
      return c.json(newInvoiceResponse(apiVersion, createdInvoice), 201)
    } catch (err: any) {
      //   log.error(err.message);
      return c.json(newErrorResponse(400, err.message))
    }
  }

  async updateInvoiceById(c: Context, req: UpdateInvoiceRequest) {
    try {
      const id = c.req.param('id')
      const invoice: UpdateInvoiceInputDto = {
        id: id,
        customer_id: req.customer_id,
        amount: req.amount,
        status: req.status,
      }
      const updatedInvoice = await this.invoiceUseCase.update(invoice)
      if (!updatedInvoice) {
        return c.json(newErrorResponse(404, 'Invoice not found'))
      }

      return c.json(newInvoiceResponse(apiVersion, updatedInvoice))
    } catch (err: any) {
      //   log.error(err.message);
      return c.json(newErrorResponse(400, err.message))
    }
  }

  async deleteInvoiceById(c: Context) {
    const { id } = c.req.param()
    try {
      await this.invoiceUseCase.delete(id)
      return c.json(null)
    } catch (err: any) {
      //   log.error(err.message);
      return c.json(newErrorResponse(400, err.message))
    }
  }
}
