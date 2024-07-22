import { OrderDetail } from "./order-detail";

export type Order = {
  orderId: string;
  customerId: string;
  orderDate: Date;
  totalPrice: number;
  status: string;
};

export type OrderListInfor = {
  items: Order[];
  totalItem: number;
  pageSize: number;
  totalPages: number;
  pageNumber: number;
};

export type OrderList = {
  order: Order;
  detail: OrderDetail[];
};
