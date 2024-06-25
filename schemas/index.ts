import email from "next-auth/providers/email";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().nonempty({
    message: "Username or email must be provided",
  }),
  password: z.string().nonempty({
    message: "Password cannot be blank",
  }),
});

export const RegisterSchema = z.object({
  fullname: z.string().min(4, "Fullname needs a minimum length of 4"),
  username: z.string().min(4, "Username needs a minimum length of 4"),
  email: z.string().email("This field is required"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password needs a minimum length of 6")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*]/,
      "Password must contain at least one special character"
    ),

  phoneNumber: z.string().refine((val) => /^0\d{9}$/.test(val), {
    message: "Phone number must start with 0 and have exactly 10 digits",
  }),
});

export const createProductSchema = z.object({
  title: z.string().min(10, "Title needs a minimum length of 10"),
  description: z.string().min(15, "Description needs a minimum length of 15"),
  imagePro: z.any(),
  price: z.coerce.number().nonnegative("Price cannot be negative"),
  categoryId: z.string().min(1, "Category is required"),
  quantity: z.coerce
    .number()
    .positive("Quantity can not be 0 or negative")
    .refine((value) => value !== 0, {
      message: "Quantity cannot be 0",
    }),
  cityId: z.string().min(1, "City is required"),
  genreId: z.string().min(1, "Genre is required"),
});
