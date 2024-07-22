import axiosClient from "@/lib/axiosClient";
import { Order, OrderListInfor } from "@/types/order";

const END_POINT = {
  CREATE: "/Order/CreateOrder",
  GET_ALL: "/Order/GetAllOrders",
  GET_ORDER: "/Order/GetOrderById",
};

export const createOrder = async (
  customerId: string,
  totalPrice: number,
  token: string
) => {
  const response = await axiosClient.post(
    `${END_POINT.CREATE}`,
    {
      customerId: customerId,
      totalPrice: totalPrice,
      status: "Pending",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getAllOrder = async ({
  token,
  CustomerId,
  Status,
  PageNumber,
  PageSize,
  SortBy,
  SortAscending,
}: {
  token: string;
  CustomerId?: string;
  Status?: string;
  PageNumber?: number;
  PageSize?: number;
  SortBy?: string;
  SortAscending?: boolean;
}): Promise<OrderListInfor> => {
  const params = new URLSearchParams();
  if (CustomerId) params.append("CustomerId", CustomerId);
  if (Status) params.append("Status", Status);
  if (PageNumber) params.append("PageNumber", PageNumber.toLocaleString());
  if (PageSize) params.append("PageSize", PageSize.toLocaleString());
  if (SortBy) params.append("SortBy", SortBy);
  if (SortAscending !== undefined)
    params.append("SortAscending", SortAscending.toString());

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

export const getOrderById = async (
  orderId: string,
  token: string
): Promise<Order> => {
  const response = await axiosClient.get(`${END_POINT.GET_ORDER}/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
