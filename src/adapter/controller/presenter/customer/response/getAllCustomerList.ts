export interface GetAllCustomerResponse {
  id: string
  name: string
}

export interface GetAllCustomerListResponse {
  apiVersion: string
  items: GetAllCustomerResponse[]
}

export function newGetAllCustomerListResponse(
  apiVersion: string,
  customerList: GetAllCustomerResponse[]
): GetAllCustomerListResponse {
  return {
    apiVersion: apiVersion,
    items: customerList,
  }
}
