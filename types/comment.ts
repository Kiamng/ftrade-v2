import { Account } from "./account";

export type Comment = {
  commentId: string;
  commenterId: string;
  productId: string;
  postDate: Date;
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
  comment: Comment;
};
