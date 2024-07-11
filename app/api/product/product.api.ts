import axiosClient from "@/lib/axiosClient";
import { createProductSchema } from "@/schemas";
import { Product, ProductList } from "@/types/product";
import * as z from "zod";

export const END_POINT = {
  GET_ALL: "/Product/GetAllProduct",
  CREATE_PRODUCT: "/Product/CreateProduct",
  GET_PRODUCT: "/Product/GetProductById",
};

export const getAllProduct = async ({
  token,
  creatorId,
  status,
  pageNumber,
  pageSize,
  isDisplay,
  category,
  genre,
  city,
  sortBy,
  sortAscending,
}: {
  token: string;
  creatorId?: string;
  status?: string;
  pageNumber?: number;
  pageSize?: number;
  isDisplay?: string;
  category?: string;
  genre?: string;
  city?: string;
  sortBy?: string;
  sortAscending?: boolean;
}): Promise<ProductList> => {
  const params = new URLSearchParams();
  if (creatorId) params.append("CreatorId", creatorId);
  if (category) params.append("CategoryName", category);
  if (city) params.append("CityName", city);
  if (genre) params.append("GenreName", genre);
  if (status) params.append("Status", status);
  if (isDisplay) params.append("IsDisplay", isDisplay);
  if (pageNumber) params.append("PageNumber", pageNumber.toString());
  if (pageSize) params.append("PageSize", pageSize.toString());
  if (sortBy) params.append("SortBy", sortBy);
  if (sortAscending !== undefined)
    params.append("SortAscending", sortAscending.toString());

  const response = await axiosClient.get(
    `${END_POINT.GET_ALL}?${params.toString()}`,
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
