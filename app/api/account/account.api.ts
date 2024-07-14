import axiosClient from "@/lib/axiosClient";
import { Account, UpdateAccount } from "@/types/account";
import * as z from "zod";
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

export const updateAccount = async (
  email: string,
  avatarUrl: string,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
  userName: string,
  fullName: string,
  phoneNumber: string,
  token: string,
  accountId: string
) => {
  const response = await axiosClient.put(
    `${END_POINT.UPDATE_ACCOUNT}/${accountId}`,
    {
      email: email,
      avatarUrl: avatarUrl,
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
      userName: userName,
      fullName: fullName,
      phoneNumber: phoneNumber,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.status;
};
