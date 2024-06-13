import axiosClient from "@/lib/axiosClient";

import { LoginSchema, RegisterSchema } from "@/schemas";
import https from "https";
import * as z from "zod";

const ENDPOINT = {
  LOGIN: "/Auth/Login",
  REGISTER: "/Auth/Register",
};

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const response = await axiosClient.post(
    ENDPOINT.LOGIN,
    {
      email: values.email,
      password: values.password,
    },
    {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    }
  );
  return response.data;
};

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  return await axiosClient.post(ENDPOINT.REGISTER, {
    email: values.email,
    passwordHash: values.password,
    userName: values.username,
    fullName: values.fullname,
    phoneNumber: values.phoneNumber,
    roleId: 3,
  });
};
