"use server";

import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { comments, soundTracks } from "../schema";
import { CommentSchema } from "@/types/comment-schema";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const postComment = action
  .inputSchema(CommentSchema)
  .action(async ({ parsedInput: { comment, trackID, userID } }) => {
    try {
      const soundTrack = await db.query.soundTracks.findFirst({
        where: eq(soundTracks.id, trackID),
      });

      if (!soundTrack) return { error: "Track not found" };

      await db.insert(comments).values({
        comment,
        trackID,
        userID,
      });

      revalidatePath(`/listen?t=${trackID}`);

      return { success: "Comment Added" };
    } catch (err) {
      return { error: "Failed to add comment" };
    }
  });
