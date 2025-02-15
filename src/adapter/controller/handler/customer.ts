import { Context } from "hono";
import { CustomerUseCase } from "../../../usecase/customer";
import {
  newGetAllCustomerListResponse,
  newGetFilteredCustomerListResponse,
} from "../presenter/customer";
import { apiVersion } from "../../../api/constants";
import { newErrorResponse } from "../presenter/response";

export class CustomerHandler {
  private customerUseCase: CustomerUseCase;
  constructor(customerUseCase: CustomerUseCase) {
    this.customerUseCase = customerUseCase;
  }

  async getAllCustomerList(c: Context) {
    try {
      const customers = await this.customerUseCase.getAll();

      const customerList = customers.map((v) => ({
        id: v.id,
        name: v.name,
      }));

      return c.json(newGetAllCustomerListResponse(apiVersion, customerList), 200);
    } catch (err: any) {
      //   log.error(err.message);
      return c.json(newErrorResponse(400, err.message));
    }
  }

  async getFilteredCustomerList(c: Context) {
    try {
      const searchQuery = c.req.query("query");
      const query = searchQuery ? searchQuery : "";
      const customers = await this.customerUseCase.getFiltered(query);
      const customerList = customers.map((v) => ({
        id: v.id,
        name: v.name,
        email: v.email,
        image_url: v.image_url,
        total_invoices: Number(v.total_invoices),
        total_pending: Number(v.total_pending),
        total_paid: Number(v.total_paid),
      }));
      return c.json(
        newGetFilteredCustomerListResponse(apiVersion, customerList), 200
      );
    } catch (err: any) {
      //   log.error(err.message);
      return c.json(newErrorResponse(400, err.message));
    }
  }

  async getAllCustomerCount(c: Context) {
    try {
      const count = await this.customerUseCase.getAllCount();
      return c.json({ count }, 200);
    } catch (err: any) {
      //   log.error(err.message);
      return c.json(newErrorResponse(400, err.message));
    }
  }
}
