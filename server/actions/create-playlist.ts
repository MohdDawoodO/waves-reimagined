"use server";

import { PlaylistSchema } from "@/types/playlist-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { playlists, users } from "../schema";

const action = createSafeActionClient();

export const createPlaylist = action
  .inputSchema(PlaylistSchema)
  .action(
    async ({ parsedInput: { description, name, userID, visibility } }) => {
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

        return { success: "Playlist created!" };
      } catch (err) {
        console.log(err);
      }
    }
  );
