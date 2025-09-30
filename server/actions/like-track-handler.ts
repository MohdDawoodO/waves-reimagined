"use server";

import { and, eq } from "drizzle-orm";
import { db } from "..";
import { likes, soundTracks } from "../schema";

export async function likeTrackHandler(userID: string, trackID: string) {
  try {
    const soundTrack = await db.query.soundTracks.findFirst({
      where: eq(soundTracks.id, trackID),
    });

    if (!soundTrack) return;

    const like = await db.query.likes.findFirst({
      where: and(eq(likes.userID, userID), eq(likes.trackID, trackID)),
      with: { soundTrack: true },
    });

    if (like) {
      await db
        .delete(likes)
        .where(and(eq(likes.userID, userID), eq(likes.trackID, trackID)));

      await db
        .update(soundTracks)
        .set({ likes: like.soundTrack.likes - 1 })
        .where(eq(soundTracks.id, trackID));
      return;
    }

    await db.insert(likes).values({
      userID,
      trackID,
    });

    await db
      .update(soundTracks)
      .set({ likes: soundTrack.likes + 1 })
      .where(eq(soundTracks.id, trackID));
  } catch (err) {
    console.log(err);
  }
}
