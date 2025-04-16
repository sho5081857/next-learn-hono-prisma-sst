export interface GetLatestInvoiceResponse {
  id: string
  name: string
  image_url: string
  email: string
  amount: number
}
export interface GetLatestInvoiceListResponse {
  apiVersion: string
  items: GetLatestInvoiceResponse[]
}

export function newGetLatestInvoiceListResponse(
  apiVersion: string,
  invoices: GetLatestInvoiceResponse[]
): GetLatestInvoiceListResponse {
  return {
    apiVersion: apiVersion,
    items: invoices,
  }
}
