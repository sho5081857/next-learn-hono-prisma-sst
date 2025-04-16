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
