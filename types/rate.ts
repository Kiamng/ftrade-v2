import { Account } from "./account";

export type RateForm = {
  customerId: string;
  descript: string;
  productId: string;
  rated: number;
};

export type Rate = {
  id: string;
  customerId: string;
  descript: string;
  productId: string;
  rated: number;
};

export type RateListInfor = {
  items: Rate[];
  totalItem: number;
  pageSize: number;
  totalPages: number;
  pageNumber: number;
};

export type userRate = {
  user: Account;
  rate: Rate;
};
