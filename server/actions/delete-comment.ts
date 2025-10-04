"use server";

import { createSafeActionClient } from "next-safe-action";
import z from "zod";
import { db } from "..";
import { comments, soundTracks } from "../schema";
import { eq } from "drizzle-orm";

const action = createSafeActionClient();

export const deleteComment = action
  .inputSchema(
    z.object({
      trackID: z.string(),
      commentID: z.number(),
    })
  )
  .action(async ({ parsedInput: { commentID, trackID } }) => {
    try {
      const track = await db.query.soundTracks.findFirst({
        where: eq(soundTracks.id, trackID),
      });

      if (track) {
        await db.delete(comments).where(eq(comments.id, commentID));

        return { success: "Comment deleted" };
      }

      return { error: "Track not found" };
    } catch (err) {
      console.log(err);
      return { error: "Failed to delete comment" };
    }
  });
