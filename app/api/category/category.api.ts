import axiosClient from "@/lib/axiosClient";
import { Category } from "@/types/category";

const END_POINT = {
  GET_ALL: "/Category/GetAllCategories",
};

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await axiosClient.get(END_POINT.GET_ALL);
  return response.data;
};
