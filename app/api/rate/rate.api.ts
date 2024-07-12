import axiosClient from "@/lib/axiosClient";
import { Rate, RateForm, RateListInfor } from "@/types/rate";

const END_POINT = {
  CREATE_RATE: "/Rating/CreateRating",
  GET_RATE: "/Rating/GetAllRatings",
};

export const rateProduct = async (rate: RateForm, token: string) => {
  const response = await axiosClient.post(`${END_POINT.CREATE_RATE}`, rate, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getAllRate = async (
  productId: string,
  token: string
): Promise<RateListInfor> => {
  const response = await axiosClient.get(
    `${END_POINT.GET_RATE}?ProductId=${productId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
