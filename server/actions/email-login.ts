"use server";

import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { compare } from "bcryptjs";
import { sendEmail } from "./email";

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
        sendEmail({
          email: existingUser.email!,
          subject: "Waves Music - Verification Email",
          text: "Your verification code",
          linkText: "verify your email",
          tokenLink: "http://localhost:3000/auth/login",
        });
        return { success: "We have sent you a verification email" };
      }
    } catch {
      return { error: "Something went wrong" };
    }
  });
