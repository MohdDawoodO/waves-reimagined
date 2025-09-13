"use server";

import { NewPasswordSchema } from "@/types/new-password-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { and, eq } from "drizzle-orm";
import { users, verificationTokens } from "../schema";
import { compare, hash } from "bcryptjs";

const action = createSafeActionClient();

export const newPassword = action
  .inputSchema(NewPasswordSchema)
  .action(async ({ parsedInput: { password, email, token } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      return { error: "User not found" };
    }

    const existingToken = await db.query.verificationTokens.findFirst({
      where: and(
        eq(verificationTokens.email, email),
        eq(verificationTokens.token, token)
      ),
    });

    if (!existingToken) {
      return { error: "Token not found, make sure the URL is correct" };
    }

    if (existingToken.expires < new Date()) {
      return { error: "Token expired" };
    }

    if (!existingUser.emailVerified) {
      await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.email, email));
    }

    const existingPassword = await compare(password, existingUser.password!);

    if (existingPassword) {
      return { error: "New password can not be the same as old password" };
    }

    const hashedPassword = await hash(password, 10);

    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.email, email));

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, email));

    return { success: "Password changed" };
  });
