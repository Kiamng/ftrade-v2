import axiosClient from "@/lib/axiosClient";
import { Product, ProductList } from "@/types/product";

export const END_POINT = {
  GET_ALL: "/Product/GetAllProduct?",
};

export const getProductByStatus = async (
  status: string,
  pageNumber: number,
  pageSize: number
): Promise<ProductList> => {
  const response = await axiosClient.get(
    `${END_POINT.GET_ALL}/Status=${status}&PageNumber=${pageNumber}&PageSize=${pageSize}`
  );
  return response.data;
};
