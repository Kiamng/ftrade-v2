import axiosClient from "@/lib/axiosClient";
import { Account } from "@/types/account";

const END_POINT = {
  GET_ACCOUNT_BY_ID: "/Account/GetAccountById",
  UPDATE_ACCOUNT: "/Account/UpdateProfile",
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

export const updateAccount = (
  account: Account,
  token: string,
  accountId: string
) => {
  const response = axiosClient.post(
    `${END_POINT.UPDATE_ACCOUNT}/${accountId}`,
    {
      email: account.email,
    }
  );
};
