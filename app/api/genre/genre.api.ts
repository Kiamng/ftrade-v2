import axiosClient from "@/lib/axiosClient";
import { Genre } from "@/types/genre";

export const END_POINT = {
  GET_ALL: "/Genre/GetAllGenres",
};

export const getAllGenre = async (token: string): Promise<Genre[]> => {
  const response = await axiosClient.get(END_POINT.GET_ALL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
