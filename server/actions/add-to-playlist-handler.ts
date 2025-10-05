"use server";

import { createSafeActionClient } from "next-safe-action";
import z from "zod";
import { db } from "..";
import { playlists, playlistTracks } from "../schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const addToPlaylistHandler = action
  .inputSchema(
    z.object({
      playlistID: z.string(),
      trackID: z.string(),
    })
  )
  .action(async ({ parsedInput: { playlistID, trackID } }) => {
    try {
      const playlist = await db.query.playlists.findFirst({
        where: eq(playlists.id, playlistID),
      });

      if (!playlist) return { error: "Playlist not found" };

      const playlistSoundTrack = await db.query.playlistTracks.findFirst({
        where: and(
          eq(playlistTracks.playlistID, playlistID),
          eq(playlistTracks.trackID, trackID)
        ),
      });

      if (playlistSoundTrack) {
        await db
          .delete(playlistTracks)
          .where(
            and(
              eq(playlistTracks.playlistID, playlistID),
              eq(playlistTracks.trackID, trackID)
            )
          );

        await db
          .update(playlists)
          .set({ tracks: playlist.tracks - 1 })
          .where(eq(playlists.id, playlistID));

        revalidatePath(`/listen?t=${trackID}`);
        return { success: "Removed track from playlist" };
      }

      await db.insert(playlistTracks).values({
        playlistID,
        trackID,
      });

      await db
        .update(playlists)
        .set({ tracks: playlist.tracks + 1 })
        .where(eq(playlists.id, playlistID));

      revalidatePath(`/listen?t=${trackID}`);

      return { success: "Added track to playlist" };
    } catch (err) {
      console.log(err);
      return { error: "Failed to add track to playlist" };
    }
  });
