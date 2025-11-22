"use server";

import { and, eq } from "drizzle-orm";
import { db } from "..";
import { playlists, playlistTracks } from "../schema";
import { createSafeActionClient } from "next-safe-action";
import z from "zod";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const bookmarkTrackHandler = action
  .inputSchema(z.object({ userID: z.string(), trackID: z.string() }))
  .action(async ({ parsedInput: { trackID, userID } }) => {
    try {
      const userPlaylist = await db.query.playlists.findFirst({
        where: and(
          eq(playlists.userID, userID),
          eq(playlists.name, "Watch Later")
        ),
      });

      if (!userPlaylist) return { error: "Failed to add track to watch later" };

      const watchLaterTrack = await db.query.playlistTracks.findFirst({
        where: and(
          eq(playlistTracks.playlistID, userPlaylist.id),
          eq(playlistTracks.trackID, trackID)
        ),
      });

      if (watchLaterTrack) {
        await db
          .delete(playlistTracks)
          .where(
            and(
              eq(playlistTracks.playlistID, userPlaylist.id),
              eq(playlistTracks.trackID, trackID)
            )
          );

        revalidatePath(`/listen/t=${trackID}`);

        return { success: "Removed track from watch later" };
      }

      await db
        .insert(playlistTracks)
        .values({ trackID, playlistID: userPlaylist.id });

      revalidatePath(`/listen/t=${trackID}`);

      return { success: "Added track to watch later" };
    } catch (err) {
      console.log(err);
      return { error: "Failed to add track to watch later" };
    }
  });
