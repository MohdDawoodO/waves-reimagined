"use server";

import { EditPlaylistSchema } from "@/types/edit-playlist-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { playlists } from "../schema";

const action = createSafeActionClient();

export const editPlaylist = action
  .inputSchema(EditPlaylistSchema)
  .action(
    async ({ parsedInput: { description, name, playlistID, visibility } }) => {
      try {
        const playlist = await db.query.playlists.findFirst({
          where: eq(playlists.id, playlistID),
        });

        if (!playlist) return { error: "Playlist not found" };

        await db
          .update(playlists)
          .set({ name, description, visibility })
          .where(eq(playlists.id, playlistID));

        return { success: "Playlist Updated" };
      } catch (err) {
        return { error: "Failed to delete playlist" };
      }
    }
  );
