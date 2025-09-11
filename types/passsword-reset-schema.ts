import z from "zod";

export const PasswordResetSchema = z.object({
  email: z.email({ error: "Email is required" }),
});
