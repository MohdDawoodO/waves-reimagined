"use server";

import { PlaylistSchema } from "@/types/playlist-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { playlists, users } from "../schema";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const createPlaylist = action
  .inputSchema(PlaylistSchema)
  .action(
    async ({
      parsedInput: { description, name, userID, visibility, trackID },
    }) => {
      try {
        const user = await db.query.users.findFirst({
          where: eq(users.id, userID),
        });

        if (!user) {
          return { error: "User not found" };
        }

        await db
          .insert(playlists)
          .values({ name, description, userID, visibility });

        if (trackID) {
          revalidatePath(`/listen?t=${trackID}`);
        } else {
          revalidatePath(`/profile/${user.handle}/playlists`);
        }

        return { success: "Playlist created!" };
      } catch (err) {
        console.log(err);
        return { error: "Failed to create playlist" };
      }
    }
  );
