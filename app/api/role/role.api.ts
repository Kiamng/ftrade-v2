import axiosClient from "@/lib/axiosClient";

import { Role } from "@/types/role";

export const END_POINT = {
  GET_ALL: "/Role/GetAllRole",
  GET_BY_ID: "/Role/GetRoleById",
  GET_BY_NAME: "/role/name?name=",
};

export const getRoleById = async (id: string): Promise<Role> => {
  const response = await axiosClient.get(`${END_POINT.GET_BY_ID}/${id}`);
  return response.data;
};

export const getRoleByName = async (name: string): Promise<Role> => {
  const response = await axiosClient.get(`${END_POINT.GET_BY_NAME}${name}`);
  return response.data;
};
