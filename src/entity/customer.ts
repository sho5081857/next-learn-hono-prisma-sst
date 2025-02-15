export interface GetAllCustomer {
    id: string;
    name: string;
}

export interface GetFilteredCustomer {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
}
