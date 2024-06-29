import axiosClient from "@/lib/axiosClient";
import { createProductSchema } from "@/schemas";
import { Product, ProductList } from "@/types/product";
import * as z from "zod";

export const END_POINT = {
  GET_ALL: "/Product/GetAllProduct?",
  CREATE_PRODUCT: "/Product/CreateProduct",
  GET_PRODUCT: "/Product/GetProductById",
};

export const getProductByStatus = async (
  status: string,
  pageNumber: number,
  pageSize: number,
  isDisplay: string
): Promise<ProductList> => {
  const response = await axiosClient.get(
    `${END_POINT.GET_ALL}Status=${status}&IsDisplay=${isDisplay}&PageNumber=${pageNumber}&PageSize=${pageSize}`
  );
  return response.data;
};

export const createProduct = async (
  values: z.infer<typeof createProductSchema>
) => {
  const response = await axiosClient.post(END_POINT.CREATE_PRODUCT, {
    title: values.title,
    description: values.description,
    imagePro: values.imagePro,
    creatorId: "87867405-e514-492d-ab89-1d3f7cecbae7",
    price: values.price,
    categoryId: values.categoryId,
    quantity: values.quantity,
    cityId: values.cityId,
    status: "Approved",
    genreId: values.genreId,
    isDisplay: "true",
  });
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await axiosClient.get(`${END_POINT.GET_PRODUCT}?id=${id}`);
  return response.data;
};
