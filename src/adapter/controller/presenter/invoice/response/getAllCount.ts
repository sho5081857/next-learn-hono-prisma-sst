export interface GetAllCountResponse {
  apiVersion: string
  data: number
}

export function newGetAllCountResponse(apiVersion: string, count: number): GetAllCountResponse {
  return {
    apiVersion: apiVersion,
    data: count,
  }
}
