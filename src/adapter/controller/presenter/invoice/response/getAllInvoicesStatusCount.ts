export interface GetStatusCountResponse {
  paid: number
  pending: number
}

export interface GetAllInvoicesStatusCountResponse {
  apiVersion: string
  data: GetStatusCountResponse
}

export function newGetAllInvoicesStatusCountResponse(
  apiVersion: string,
  counts: GetStatusCountResponse
): GetAllInvoicesStatusCountResponse {
  return {
    apiVersion: apiVersion,
    data: counts,
  }
}
