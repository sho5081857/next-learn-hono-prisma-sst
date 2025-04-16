export interface GetPagesResponse {
  apiVersion: string
  data: number
}

export function newGetPagesResponse(apiVersion: string, count: number): GetPagesResponse {
  return {
    apiVersion: apiVersion,
    data: count,
  }
}
