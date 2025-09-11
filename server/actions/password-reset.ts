"use server";

import { PasswordResetSchema } from "@/types/passsword-reset-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { sendVerificationTokenEmail } from "./verification-token";

const action = createSafeActionClient();

export const passwordReset = action
  .inputSchema(PasswordResetSchema)
  .action(async ({ parsedInput: { email } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) return { error: "User not found" };

    await sendVerificationTokenEmail(email);

    return {
      success: "Password reset link sent! Check your inbox to continue.",
    };
  });
