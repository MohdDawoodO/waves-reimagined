import z from "zod";

export const AccountSettingsSchema = z.object({
  userID: z.string(),
  handle: z
    .string()
    .regex(/^[a-z0-9]+$/, {
      error: "Handles can only have lowercase alphabets and numbers",
    })
    .lowercase()
    .min(3, { error: "Handle must be at least 3 characters long" })
    .max(20, { error: "Handle can be no longer than 20 characters" }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long" })
    .optional(),
  newPassword: z
    .string()
    .min(8, { error: "New Password must be at least 8 characters long" })
    .optional(),
});
