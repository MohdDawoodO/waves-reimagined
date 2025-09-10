"use server";

import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { accounts, users } from "../schema";
import { compare } from "bcryptjs";
import { checkVerificationToken } from "./verification-token";
import { signIn } from "../auth";

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

      if (!existingUser.password) {
        const existingAccount = await db.query.accounts.findFirst({
          where: eq(accounts.userId, existingUser.id),
        });

        return {
          error: `This account was created with ${existingAccount?.provider}. Try logging in with ${existingAccount?.provider} instead.`,
        };
      }

      const passwordMatch = await compare(password, existingUser.password!);

      if (!passwordMatch) {
        return { error: "Email or password is incorrect" };
      }

      if (!existingUser.emailVerified) {
        checkVerificationToken(email, password);
        return { success: "We have sent you a verification email" };
      }

      await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
        redirectTo: "/",
      });

      return { success: "Log in complete" };
    } catch (error: any) {
      return { error: "Something went wrong" };
    }
  });
