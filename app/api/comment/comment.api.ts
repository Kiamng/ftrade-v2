import axiosClient from "@/lib/axiosClient";
import { CommentListInfor } from "@/types/comment";

const END_POINT = {
  CREATE_COMMENT: "/Comment/CreateComment",
  GET_ALL: "/Comment/GetCommentsByProductId",
};

export const createComment = async (
  token: string,
  userId: string,
  productId: string,
  comment: string
) => {
  const response = await axiosClient.post(
    `${END_POINT.CREATE_COMMENT}`,
    {
      commenterId: userId,
      productId: productId,
      descript: comment,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.status;
};

export const getAllComment = async (
  productId: string,
  token: string
): Promise<CommentListInfor> => {
  const response = await axiosClient.get(
    `${END_POINT.GET_ALL}?ProductId=${productId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
