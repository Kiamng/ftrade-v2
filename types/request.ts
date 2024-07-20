import { Account } from "./account";
import { Product } from "./product";

export type RequestForm = {
  buyerId: string;
  sellerId: string;
  productSellerId: string;
  productBuyerId: string | undefined;
  status: string;
};

export type productsByRequest = {
  buyer: Account;
  productBuyer: Product | null;
};

export type requestTableData = {
  productSeller: Product;
  listProductByRequest: {
    requestId: string;
    buyer: Account;
    productBuyer: Product | null;
    requestDate: Date;
    requestStatus: string;
  }[];
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

export type yourRequest = {
  requestId: string;
  seller: Account;
  buyer: Account;
  productBuyer: Product | null;
  productSeller: Product;
  createdDate: Date;
  status: string;
};
