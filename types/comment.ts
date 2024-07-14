import { Account } from "./account";

export type Comment = {
  commenterId: string;
  productId: string;
  descript: string;
};

export type CommentListInfor = {
  items: Comment[];
  totalItem: number;
  pageSize: number;
  totalPages: number;
  pgaeNumber: number;
};

export type CommentByUser = {
  user: Account;
};
