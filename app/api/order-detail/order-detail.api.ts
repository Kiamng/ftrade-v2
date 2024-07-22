import axiosClient from "@/lib/axiosClient";
import { OrderDetail } from "@/types/order-detail";

const END_POINT = {
  CREATE: "/OrderDetail/CreateOrderDetail",
  GET_BY_ORDER_ID: "/OrderDetail/GetOrderDetailByOrderId",
};

export type OrderDetailForm = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
};

export const createOrderDetail = async (
  orderId: string,
  values: OrderDetailForm,
  token: string
) => {
  const response = await axiosClient.post(
    `${END_POINT.CREATE}`,
    {
      orderId: orderId,
      productId: values.productId,
      productName: values.productName,
      quantity: values.quantity,
      price: values.price,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const getOrderDetailByOrderId = async (
  orderId: string,
  token: string
): Promise<OrderDetail[]> => {
  const response = await axiosClient.get(
    `${END_POINT.GET_BY_ORDER_ID}/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
