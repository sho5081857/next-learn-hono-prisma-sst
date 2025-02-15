export interface GetAllCustomerResponse {
  id: string;
  name: string;
}

export interface GetAllCustomerListResponse {
  apiVersion: string;
  items: GetAllCustomerResponse[];
}

export function newGetAllCustomerListResponse(
  apiVersion: string,
  customers: GetAllCustomerResponse[]
): GetAllCustomerListResponse {
  return {
    apiVersion: apiVersion,
    items: customers,
  };
}

export interface GetFilteredCustomerResponse {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
}

export interface GetFilteredCustomerListResponse {
  apiVersion: string;
  items: GetFilteredCustomerResponse[];
}

export function newGetFilteredCustomerListResponse(
  apiVersion: string,
  customers: GetFilteredCustomerResponse[]
): GetFilteredCustomerListResponse {
  return {
    apiVersion: apiVersion,
    items: customers,
  };
}
