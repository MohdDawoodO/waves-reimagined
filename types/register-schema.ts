import z, { email } from "zod";

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(3, {
      error: "Please enter a name with 3 or more characters",
    })
    .max(20, { error: "Name can be no longer than 20 characters" }),
  email: z.email(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long" }),
  confirmPassword: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long" }),
});
