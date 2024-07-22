import { Product } from "./product";

export type OrderDetail = {
  orderId: string;
  product: Product;
  productName: string;
  quantity: number;
  price: number;
};
