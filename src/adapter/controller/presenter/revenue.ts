export interface RevenueResponse {
  month: string;
  revenue: number;
}

export interface GetAllRevenueListResponse {
  apiVersion: string;
  items: RevenueResponse[];
}

export function newGetAllRevenueListResponse(
  apiVersion: string,
  revenues: RevenueResponse[]
): GetAllRevenueListResponse {
  return {
    apiVersion: apiVersion,
    items: revenues,
  };
}
