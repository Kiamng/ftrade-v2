import { Account } from "./account";
import { Product } from "./product";

export type RequestForm = {
  buyerId: string;
  sellerId: string;
  productSellerId: string;
  productBuyerId: string;
  status: string;
};

export type requestTableData = {
  seller: Account;
  buyer: Account;
  productBuyer: Product | null;
  productSeller: Product;
  createdDate: Date;
  status: string;
};

export type Request = {
  id: string;
  buyerId: string;
  sellerId: string;
  productSellerId: string;
  productBuyerId: string;
  createdDate: Date;
  status: string;
};

export type RequestListInfor = {
  items: Request[];
  totalItem: number;
  pageSize: number;
  totalPages: number;
  pageNumber: number;
};
