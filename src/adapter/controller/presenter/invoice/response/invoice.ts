export interface InvoiceDataResponse {
  id: string
  customer_id: string
  amount: number
  date: string
  status: 'pending' | 'paid'
}

export interface InvoiceResponse {
  apiVersion: string
  data: InvoiceDataResponse
}

export function newInvoiceResponse(
  apiVersion: string,
  invoice: InvoiceDataResponse
): InvoiceResponse {
  return {
    apiVersion: apiVersion,
    data: invoice,
  }
}
