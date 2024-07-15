import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const productSchema = z.object({
  productId: z.string(),
  title: z.string(),
  category: z.object({
    categoryId: z.string(),
    name: z.string(),
  }),
  genre: z.object({
    genreId: z.string(),
    name: z.string(),
  }),
  city: z.object({
    cityId: z.string(),
    name: z.string(),
  }),
  denyRes: z
    .string()
    .nullable()
    .transform((value) => value ?? ""),
  isDisplay: z.string(),
  status: z.string(),
});

export type ProductSchema = z.infer<typeof productSchema>;

export const requestSchema = z.object({
  requestId: z.string(),
  buyer: z.object({
    accountId: z.string(),
    userName: z.string(),
  }),
  productBuyer: z
    .object({
      creatorId: z.string(),
      productId: z.string(),
      title: z.string(),
    })
    .nullable(),
  productSeller: z.object({
    creatorId: z.string(),
    productId: z.string(),
    title: z.string(),
  }),
  status: z.string(),
});
export type RequestSchema = z.infer<typeof requestSchema>;
