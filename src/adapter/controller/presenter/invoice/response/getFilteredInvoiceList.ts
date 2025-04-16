export interface GetFilteredInvoiceResponse {
  id: string
  customer_id: string
  name: string
  email: string
  image_url: string
  date: string
  amount: number
  status: 'pending' | 'paid'
}

export interface GetFilteredInvoiceListResponse {
  apiVersion: string
  items: GetFilteredInvoiceResponse[]
  totalItems: number
}

export function newGetFilteredInvoiceListResponse(
  apiVersion: string,
  invoices: GetFilteredInvoiceResponse[],
  totalItems: number
): GetFilteredInvoiceListResponse {
  return {
    apiVersion: apiVersion,
    items: invoices,
    totalItems: totalItems,
  }
}
