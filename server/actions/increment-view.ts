"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { soundTracks } from "../schema";
import { revalidatePath } from "next/cache";

export async function incrementView(trackID: string) {
  const soundTrack = await db.query.soundTracks.findFirst({
    where: eq(soundTracks.id, trackID),
  });

  if (!soundTrack) return;

  await db
    .update(soundTracks)
    .set({ views: soundTrack.views + 1 })
    .where(eq(soundTracks.id, trackID));

  revalidatePath(`/listen?t=${trackID}`);
}
