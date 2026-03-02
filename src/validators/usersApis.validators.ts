import { z } from "zod";

// signup
export const userAuthRegisterVaildator = z.object({
  body: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.string().length(12, { message: "Phone number must be at least 12 characters" }).optional(),
  }),
});

export type UserAuthRegisterVaildator = z.infer<
  typeof userAuthRegisterVaildator
>;

// login
export const userAuthLoginVaildator = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export type UserAuthLoginVaildator = z.infer<typeof userAuthLoginVaildator>;

// forget password
export const userAuthForgetPasswordVaildator = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export type UserAuthForgetPasswordVaildator = z.infer<
  typeof userAuthForgetPasswordVaildator
>;

// reset password
export const userAuthResetPasswordVaildator = z.object({
  body: z.object({
    token: z.string().min(1),
    newPassword: z.string().min(8),
    userId: z.string().uuid({ message: "Invalid User ID format" }),
  }),
});

export type UserAuthResetPasswordVaildator = z.infer<
  typeof userAuthResetPasswordVaildator
>;
