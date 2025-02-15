import { Context } from 'hono'
import { InvoiceUseCase } from '../../../usecase/invoice'
import { newErrorResponse } from '../presenter/response'
import {
  newGetAllCountResponse,
  newGetAllInvoicesStatusCountResponse,
  newGetFilteredInvoiceListResponse,
  newGetInvoiceByIdResponse,
  newGetLatestInvoiceListResponse,
  newGetPagesResponse,
  newInvoiceResponse,
} from '../presenter/invoice/response/invoice'
import { apiVersion } from '../../../api/constants'
import {
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
} from '../presenter/invoice/request/invoice-request'
// import { log } from '../../../logger';

export class InvoiceHandler {
  private invoiceUseCase: InvoiceUseCase

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
        parseInt(offset),
        parseInt(limit)
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

  async createInvoice(c: Context, invoice: CreateInvoiceRequest) {
    try {
      const createdInvoice = await this.invoiceUseCase.create(invoice)
      return c.json(newInvoiceResponse(apiVersion, createdInvoice), 201)
    } catch (err: any) {
      //   log.error(err.message);
      return c.json(newErrorResponse(400, err.message))
    }
  }

  async updateInvoiceById(c: Context, invoice: UpdateInvoiceRequest) {
    try {
      const id = c.req.param('id')
      const updatedInvoice = await this.invoiceUseCase.update(id, invoice)
      if (!updatedInvoice) {
        return c.json(newErrorResponse(404, 'Invoice not found'))
      }

      return c.json({
        apiVersion: apiVersion,
        data: {
          id: updatedInvoice.id,
          customerId: updatedInvoice.customer_id,
          status: updatedInvoice.status,
          amount: updatedInvoice.amount,
        },
      })
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
