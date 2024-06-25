import axiosClient, { axiosClientUpload } from "@/lib/axiosClient";

const END_POINT = {
  POST_IMAGE: "/Product/UploadFileProductImage",
};

export const uploadImage = async (imageFile: File) => {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);
    const response = await axiosClientUpload.post(
      END_POINT.POST_IMAGE,
      formData
    );

    return response.data;
  } catch (error) {
    console.error("Error upload product image api:", error);
    throw error;
  }
};
