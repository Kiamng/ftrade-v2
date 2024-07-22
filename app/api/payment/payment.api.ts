import axiosClient from "@/lib/axiosClient";

const END_POINT = {
  CREATE: "/VNPay/CreatePayment/create",
};

export const createPayment = async (
  orderID: string,
  totalPrice: number,
  token: string
) => {
  const response = await axiosClient.post(
    `${END_POINT.CREATE}`,
    {
      orderID: orderID,
      totalPrice: totalPrice,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
