import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8, {
    error: "Password must be at least 8 characters long",
  }),
});
