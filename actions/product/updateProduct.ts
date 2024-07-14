"use server";

import { updateProduct } from "@/app/api/product/product.api";
import { createProductSchema } from "@/schemas";
import * as z from "zod";

export const UpdateProductAction = async (
  values: z.infer<typeof createProductSchema>,
  isDisplay: string,
  token: string,
  productId: string
) => {
  const validatedFields = createProductSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {
    title,
    description,
    imagePro,
    price,
    categoryId,
    quantity,
    cityId,
    genreId,
  } = validatedFields.data;

  const newCreatedProduct = {
    title,
    description,
    imagePro,
    price,
    categoryId,
    quantity,
    cityId,
    genreId,
  };

  const response = await updateProduct(
    newCreatedProduct,
    token,
    productId,
    isDisplay
  );

  return response;
};
