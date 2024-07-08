import axiosClient from "@/lib/axiosClient";
import { City } from "@/types/city";

const END_POINT = {
  GET_ALL: "/City/GetAllCities",
};

export const getAllCities = async (token: string): Promise<City[]> => {
  const response = await axiosClient.get(END_POINT.GET_ALL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
