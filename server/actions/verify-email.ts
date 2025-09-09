"use server";

import { and, eq } from "drizzle-orm";
import { db } from "..";
import { users, verificationTokens } from "../schema";
import { createSafeActionClient } from "next-safe-action";
import z from "zod";

const action = createSafeActionClient();

export const verifyEmail = action
  .inputSchema(z.object({ email: z.email(), token: z.string() }))
  .action(async ({ parsedInput: { email, token } }) => {
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

    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.email, email));

    await db
      .update(users)
      .set({ emailVerified: new Date() })
      .where(eq(users.email, email));

    return { success: "Email verified" };
  });
