"use server";

import { createProduct } from "@/app/api/product/product.api";
import { createProductSchema } from "@/schemas";
import * as z from "zod";

export const CreateProductAction = async (
  values: z.infer<typeof createProductSchema>,
  userId: string,
  token: string
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

  const response = await createProduct(newCreatedProduct, userId, token);
  // if (response.data.status === 400 || response.data.status === 404) {
  //   return { error: response.data.message };
  // }

  return response;
};
