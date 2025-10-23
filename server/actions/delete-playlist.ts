"use server";

import { createSafeActionClient } from "next-safe-action";
import z from "zod";
import { db } from "..";
import { eq } from "drizzle-orm";
import { playlists } from "../schema";

const action = createSafeActionClient();

export const deletePlaylist = action
  .inputSchema(z.object({ playlistID: z.string() }))
  .action(async ({ parsedInput: { playlistID } }) => {
    try {
      const playlist = await db.query.playlists.findFirst({
        where: eq(playlists.id, playlistID),
      });

      if (!playlist) return { error: "Playlist not found" };

      await db.delete(playlists).where(eq(playlists.id, playlistID));

      return { success: "Playlist deleted" };
    } catch (err) {
      console.log(err);
      return { error: "Failed to delete playlist" };
    }
  });
