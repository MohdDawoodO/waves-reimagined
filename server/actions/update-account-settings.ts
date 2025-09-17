"use server";

import { AccountSettingsSchema } from "@/types/account-settings-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { and, eq, ne } from "drizzle-orm";
import { users } from "../schema";
import { compare, hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const updateAcountSettings = action
  .inputSchema(AccountSettingsSchema)
  .action(
    async ({ parsedInput: { handle, userID, password, newPassword } }) => {
      const existingHandle = await db.query.users.findFirst({
        where: and(eq(users.handle, handle), ne(users.id, userID)),
      });

      if (existingHandle) {
        return { error: "This handle is already taken. Try another one." };
      }

      if (password) {
        if (!newPassword) {
          return { error: "Create a new password to change the old one" };
        }

        const user = await db.query.users.findFirst({
          where: eq(users.id, userID),
        });

        if (!user) {
          return { error: "User not found" };
        }

        const passwordMatch = await compare(password, user.password!);

        console.log(user.password, password, passwordMatch);

        if (!passwordMatch) {
          return { error: "Password is incorrect" };
        }

        const passwordCompare = await compare(newPassword, user.password!);

        if (passwordCompare) {
          return {
            error: "New password can not be the same as the old password",
          };
        }

        const hashedPassword = await hash(newPassword, 10);

        await db
          .update(users)
          .set({
            handle,
            password: hashedPassword,
          })
          .where(eq(users.id, userID));

        revalidatePath("/settings/account");

        return { success: "Settings updated!" };
      }

      await db
        .update(users)
        .set({
          handle,
        })
        .where(eq(users.id, userID));

      revalidatePath("/settings/account");

      return { success: "Settings updated!" };
    }
  );
