export interface GetFilteredCustomerResponse {
  id: string
  name: string
  email: string
  image_url: string
  total_invoices: number
  total_pending: number
  total_paid: number
}

export interface GetFilteredCustomerListResponse {
  apiVersion: string
  items: GetFilteredCustomerResponse[]
}

export function newGetFilteredCustomerListResponse(
  apiVersion: string,
  customerList: GetFilteredCustomerResponse[]
): GetFilteredCustomerListResponse {
  return {
    apiVersion: apiVersion,
    items: customerList,
  }
}
