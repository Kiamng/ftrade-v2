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
  isDisplay: string,
  token: string
): Promise<ProductList> => {
  const response = await axiosClient.get(
    `${END_POINT.GET_ALL}Status=${status}&IsDisplay=${isDisplay}&PageNumber=${pageNumber}&PageSize=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const createProduct = async (
  values: z.infer<typeof createProductSchema>,
  userId: string,
  token: string
) => {
  const response = await axiosClient.post(
    END_POINT.CREATE_PRODUCT,
    {
      title: values.title,
      description: values.description,
      imagePro: values.imagePro,
      creatorId: userId,
      price: values.price,
      categoryId: values.categoryId,
      quantity: values.quantity,
      cityId: values.cityId,
      status: "Pending",
      genreId: values.genreId,
      isDisplay: "true",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.status;
};

export const getProductById = async (
  id: string,
  token: string
): Promise<Product> => {
  const response = await axiosClient.get(`${END_POINT.GET_PRODUCT}?id=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getDisplayingProductByUserId = async (
  userId: string,
  pageNumber: number,
  pageSize: number,
  token: string
): Promise<ProductList> => {
  const response = await axiosClient.get(
    `${END_POINT.GET_ALL}?CreatorId=${userId}&Status=Approved&IsDisplay=true&PageNumber=${pageNumber}&PageSize=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
