"use server";

import { v2 as cloudinary } from "cloudinary";
import { ProfileSettingsSchema } from "@/types/profile-settings-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { userAvatars, users } from "../schema";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const updateProfileSettings = action
  .inputSchema(ProfileSettingsSchema)
  .action(
    async ({
      parsedInput: { displayName, userID, avatar, profileDescription },
    }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.id, userID),
        with: { user_avatar: true },
      });

      if (!user) return { error: "User not found" };

      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME!,
        api_key: process.env.CLOUDINARY_API_KEY!,
        api_secret: process.env.CLOUDINARY_API_SECRET!,
      });

      if (!avatar) {
        await db
          .update(users)
          .set({ image: null, name: displayName, profileDescription })
          .where(eq(users.id, userID));

        if (user.user_avatar) {
          await cloudinary.uploader.destroy(user.user_avatar.publicID!);

          await db.delete(userAvatars).where(eq(userAvatars.userID, userID));
        }

        revalidatePath("/settings/profile");
        return { success: "Settings Updated" };
      }

      if (user.image !== avatar) {
        if (user.user_avatar) {
          await cloudinary.uploader.destroy(user.user_avatar.publicID!);
        }

        const data = await cloudinary.uploader.upload(avatar);

        await db
          .update(users)
          .set({ image: data?.fileURL, profileDescription, name: displayName })
          .where(eq(users.id, userID));

        if (user.user_avatar) {
          await db
            .update(userAvatars)
            .set({ imageURL: data?.fileURL, publicID: data?.fileID, userID })
            .where(eq(userAvatars.userID, userID));
        } else {
          await db.insert(userAvatars).values({
            imageURL: data?.fileURL!,
            publicID: data?.fileID!,
            userID,
          });
        }
      }

      await db
        .update(users)
        .set({ profileDescription, name: displayName })
        .where(eq(users.id, userID));

      revalidatePath("/settings/profile");
      return { success: "Settings Updated" };
    }
  );
