import * as z from "zod";

export const EditProfileSchema = z.object({
  fullname: z.string().min(4, "Fullname needs a minimum length of 4"),
  userName: z.string().min(4, "Fullname needs a minimum length of 4"),
  phoneNumber: z.string().refine((val) => /^0\d{9}$/.test(val), {
    message: "Phone number must start with 0 and have exactly 10 digits",
  }),
  email: z.string(),
});

export const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "You must enter the old password"),
    newPassword: z
      .string()
      .min(6, "Password needs a minimum length of 6")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(6, "Password needs a minimum length of 6"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
