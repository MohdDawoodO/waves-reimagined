"use server";

import { RegisterSchema } from "@/types/register-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { hash } from "bcryptjs";

const action = createSafeActionClient();

export const emailRegister = action
  .inputSchema(RegisterSchema)
  .action(
    async ({ parsedInput: { name, email, password, confirmPassword } }) => {
      try {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (existingUser) {
          return { error: "Email already registered, log in instead" };
        }

        if (password !== confirmPassword) {
          return { error: "Passwords does not match" };
        }

        const hashedPassword = await hash(password, 10);

        await db.insert(users).values({
          name,
          email: email,
          password: hashedPassword,
        });

        return { success: "Email Registered" };
      } catch {
        return { error: "Something went wrong" };
      }
    }
  );
