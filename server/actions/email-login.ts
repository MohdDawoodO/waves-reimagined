"use server";

import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { and, eq } from "drizzle-orm";
import { accounts, twoFactorCodes, users } from "../schema";
import { compare } from "bcryptjs";
import { sendVerificationTokenEmail } from "./verification-token";
import { signIn } from "../auth";
import { SendTwoFactorCodeEmail } from "./two-factor-code";

const action = createSafeActionClient();

export const emailLogin = action
  .inputSchema(LoginSchema)
  .action(
    async ({ parsedInput: { email, password, twoFactorCode, firstLogin } }) => {
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
          sendVerificationTokenEmail(email, password);
          return { success: "We have sent you a verification email" };
        }

        if (!firstLogin) {
          if (!twoFactorCode) {
            SendTwoFactorCodeEmail(email);
            return { verification: "We have sent you a verification code" };
          }

          const existingCode = await db.query.twoFactorCodes.findFirst({
            where: and(
              eq(twoFactorCodes.email, email),
              eq(twoFactorCodes.code, twoFactorCode)
            ),
          });

          if (!twoFactorCode) {
            return { error: "Enter your two factor code" };
          }

          if (!existingCode) {
            return { error: "Incorrect Code" };
          }

          if (existingCode.expires < new Date()) {
            await db
              .delete(twoFactorCodes)
              .where(eq(twoFactorCodes.email, email));
            return { error: "Code expired" };
          }

          await db
            .delete(twoFactorCodes)
            .where(eq(twoFactorCodes.email, email));
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
    }
  );
