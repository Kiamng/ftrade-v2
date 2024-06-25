import axiosClient from "@/lib/axiosClient";
import { City } from "@/types/city";

const END_POINT = {
  GET_ALL: "/City/GetAllCities",
};

export const getAllCities = async (): Promise<City[]> => {
  const response = await axiosClient.get(END_POINT.GET_ALL);
  return response.data;
};
