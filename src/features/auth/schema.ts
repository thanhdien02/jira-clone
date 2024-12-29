import { z } from "zod";

export const schemaLogin = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must have latest 8 character" })
    .max(256, { message: "Password must have less than 256 character" }),
});
export const schemaSignUp = z.object({
  name: z
    .string()
    .min(4, { message: "Name must have latest 4 character" })
    .max(256, { message: "Name must have less than 256 character" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must have latest 8 character" })
    .max(256, { message: "Password must have less than 256 character" }),
});
