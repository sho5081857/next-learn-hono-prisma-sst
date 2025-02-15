export interface Invoice {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  status: "pending" | "paid";
}
export interface GetLatestInvoice {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: number;
}

export interface GetFilteredInvoice {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: "pending" | "paid";
}

export interface GetInvoiceById {
  id: string;
  customer_id: string;
  amount: number;
  status: "pending" | "paid";
}
