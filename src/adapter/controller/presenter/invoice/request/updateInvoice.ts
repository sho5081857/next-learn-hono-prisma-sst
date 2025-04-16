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
