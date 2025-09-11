import z from "zod";

export const NewPasswordSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { error: "New password must be at least 8 characters long" }),
  token: z.string(),
});
