import axiosClient from "@/lib/axiosClient";
import { Request, RequestForm, RequestListInfor } from "@/types/request";

const END_POINT = {
  CREATE_REQUEST: "/RequestHistory/CreateRequestHistory",
  GET_REQUEST: "/RequestHistory/GetAllRequestHistories",
  UPDATE_REQUEST: "/RequestHistory/UpdateRequestHistory",
  UPDATE_REQUEST_STATUS: "/RequestHistory/UpdateStatus",
  DELETE_REQUEST: "/RequestHistory/DeleteRequestHistory",
};

export const createRequest = async (request: RequestForm, token: string) => {
  const response = await axiosClient.post(
    `${END_POINT.CREATE_REQUEST}`,
    {
      buyerId: request.buyerId,
      sellerId: request.sellerId,
      productSellerId: request.productSellerId,
      productBuyerId: request.productBuyerId,
      status: request.status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.status;
};

export const getAllRequest = async ({
  token,
  BuyerId,
  SellerId,
  ProductSellerId,
  ProductBuyerId,
  PageNumber,
  PageSize,
  SortBy,
  SortAscending,
}: {
  token: string;
  BuyerId?: string;
  SellerId?: string;
  ProductSellerId?: string;
  ProductBuyerId?: string;
  PageNumber?: number;
  PageSize?: number;
  SortBy?: string;
  SortAscending?: boolean;
}): Promise<RequestListInfor> => {
  const params = new URLSearchParams();
  if (BuyerId) params.append("BuyerId", BuyerId);
  if (SellerId) params.append("SellerId", SellerId);
  if (ProductSellerId) params.append("ProductSellerId", ProductSellerId);
  if (ProductBuyerId) params.append("ProductBuyerId", ProductBuyerId);
  if (PageNumber) params.append("PageNumber", PageNumber.toString());
  if (PageSize) params.append("PageSize", PageSize.toString());
  if (SortBy) params.append("SortBy", SortBy);
  if (SortAscending !== undefined)
    params.append("SortAscending", SortAscending.toString());
  const response = await axiosClient.get(
    `${END_POINT.GET_REQUEST}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateRequest = async (
  requestId: string,
  requestData: RequestForm,
  token: string
) => {
  const response = await axiosClient.put(
    `${END_POINT.UPDATE_REQUEST}/${requestId}`,
    requestData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const updateRequestStatus = async (
  requestId: string,
  status: string,
  token: string
) => {
  const response = await axiosClient.put(
    `${END_POINT.UPDATE_REQUEST_STATUS}/${requestId}/status`,
    {
      status: status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.status;
};

export const deleteRequest = async (id: string, token: string) => {
  const response = await axiosClient.delete(
    `${END_POINT.DELETE_REQUEST}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
