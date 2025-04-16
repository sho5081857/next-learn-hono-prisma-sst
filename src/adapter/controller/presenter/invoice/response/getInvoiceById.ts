export interface GetInvoiceByIdDataResponse {
  id: string
  customer_id: string
  amount: number
  status: 'pending' | 'paid'
}

export interface GetInvoiceByIdResponse {
  apiVersion: string
  data: GetInvoiceByIdDataResponse
}

export function newGetInvoiceByIdResponse(
  apiVersion: string,
  invoice: GetInvoiceByIdDataResponse
): GetInvoiceByIdResponse {
  return {
    apiVersion: apiVersion,
    data: invoice,
  }
}
