import { z } from "zod";

export const SignInSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(8, {
    message: "Invalid password",
  }),
});

export type SignInValues = z.infer<typeof SignInSchema>;
