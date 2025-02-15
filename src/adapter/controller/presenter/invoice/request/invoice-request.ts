import { z } from 'zod'

const FormSchema = z.object({
  id: z.string(),
  customer_id: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
})

export const createInvoiceRequest = FormSchema.omit({ id: true, date: true })
export const updateInvoiceRequest = FormSchema.omit({ date: true, id: true })

export interface CreateInvoiceRequest {
  customer_id: string
  amount: number
  status: 'pending' | 'paid'
}

export function newCreateInvoiceRequest(data: CreateInvoiceRequest): CreateInvoiceRequest {
  return {
    customer_id: data.customer_id,
    amount: data.amount,
    status: data.status,
  }
}

export interface UpdateInvoiceRequest {
  customer_id: string
  amount: number
  status: 'pending' | 'paid'
}

export function newUpdateInvoiceRequest(data: UpdateInvoiceRequest): UpdateInvoiceRequest {
  return {
    customer_id: data.customer_id,
    amount: data.amount,
    status: data.status,
  }
}
