import z, { email } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(3, {
    error: "Please enter a name with 3 or more characters",
  }),
  email: z.email(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long" }),
  confirmPassword: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long" }),
});
