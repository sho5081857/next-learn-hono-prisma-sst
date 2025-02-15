export interface InvoiceDataResponse {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  status: "pending" | "paid";
}

export interface GetLatestInvoiceResponse {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: number;
}
export interface GetLatestInvoiceListResponse {
  apiVersion: string;
  items: GetLatestInvoiceResponse[];
}

export function newGetLatestInvoiceListResponse(
  apiVersion: string,
  invoices: GetLatestInvoiceResponse[]
): GetLatestInvoiceListResponse {
  return {
    apiVersion: apiVersion,
    items: invoices,
  };
}

export interface GetFilteredInvoiceResponse {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: "pending" | "paid";
}

export interface GetFilteredInvoiceListResponse {
  apiVersion: string;
  items: GetFilteredInvoiceResponse[];
  totalItems: number;
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
  };
}

export interface GetInvoiceByIdDataResponse {
  id: string;
  customer_id: string;
  amount: number;
  status: "pending" | "paid";
}

export interface GetStatusCountResponse {
  paid: number;
  pending: number;
}

export interface GetInvoiceByIdResponse {
  apiVersion: string;
  data: GetInvoiceByIdDataResponse;
}

export function newGetInvoiceByIdResponse(
  apiVersion: string,
  invoice: GetInvoiceByIdDataResponse
): GetInvoiceByIdResponse {
  return {
    apiVersion: apiVersion,
    data: invoice,
  };
}

export interface GetAllCountResponse {
  apiVersion: string;
  data: number;
}

export function newGetAllCountResponse(
  apiVersion: string,
  count: number
): GetAllCountResponse {
  return {
    apiVersion: apiVersion,
    data: count,
  };
}

export interface GetPagesResponse {
  apiVersion: string
  data: number
}

export function newGetPagesResponse(apiVersion: string, count: number): GetAllCountResponse {
  return {
    apiVersion: apiVersion,
    data: count,
  }
}

export interface InvoiceResponse {
  apiVersion: string;
  data: InvoiceDataResponse;
}

export function newInvoiceResponse(
  apiVersion: string,
  invoice: InvoiceDataResponse
): InvoiceResponse {
  return {
    apiVersion: apiVersion,
    data: invoice,
  };
}

export interface getAllInvoicesStatusCountResponse {
  apiVersion: string;
  data: GetStatusCountResponse;
}

export function newGetAllInvoicesStatusCountResponse(
  apiVersion: string,
  counts: GetStatusCountResponse
): getAllInvoicesStatusCountResponse {
  return {
    apiVersion: apiVersion,
    data: counts,
  };
}
