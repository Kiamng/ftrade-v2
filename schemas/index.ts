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
  role: z.string({ required_error: "Please select your role" }),
});
