import axiosClient from "@/lib/axiosClient";
import { Account } from "@/types/account";

const END_POINT = {
  GET_ACCOUNT_BY_ID: "/Account/GetAccountById",
};

export const getUserById = async (
  id: string,
  token: string
): Promise<Account> => {
  const response = await axiosClient.get(
    `${END_POINT.GET_ACCOUNT_BY_ID}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
