export interface GetAllRevenueResponse {
  month: string
  revenue: number
}

export interface GetAllRevenueListResponse {
  apiVersion: string
  items: GetAllRevenueResponse[]
}

export function newGetAllRevenueListResponse(
  apiVersion: string,
  revenueList: GetAllRevenueResponse[]
): GetAllRevenueListResponse {
  return {
    apiVersion: apiVersion,
    items: revenueList,
  }
}
