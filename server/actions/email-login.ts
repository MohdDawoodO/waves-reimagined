"use server";

import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { compare } from "bcryptjs";
import { checkVerificationToken } from "./verification-token";

const action = createSafeActionClient();

export const emailLogin = action
  .inputSchema(LoginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!existingUser) {
        return { error: "Email not registered" };
      }

      const passwordMatch = await compare(password, existingUser.password!);
      if (!passwordMatch) {
        return { error: "Email or password is incorrect" };
      }

      if (!existingUser.emailVerified) {
        checkVerificationToken(email, existingUser.password!);
        return { success: "We have sent you a verification email" };
      }
    } catch {
      return { error: "Something went wrong" };
    }
  });
