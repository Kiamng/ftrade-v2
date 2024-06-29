import axiosClient from "@/lib/axiosClient";
import { Account } from "@/types/account";

const END_POINT = {
  GET_ACCOUNT_BY_ID: "/Account/GetAccountById",
};

export const getUserById = async (id: string): Promise<Account> => {
  const response = await axiosClient.get(
    `${END_POINT.GET_ACCOUNT_BY_ID}/${id}`
  );
  return response.data;
};
