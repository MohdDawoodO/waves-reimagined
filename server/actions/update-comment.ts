"use server";

import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { and, eq } from "drizzle-orm";
import { comments } from "../schema";
import { revalidatePath } from "next/cache";
import { EditCommentSchema } from "@/types/edit-comment-schema";

const action = createSafeActionClient();

export const updateComment = action
  .inputSchema(EditCommentSchema)
  .action(async ({ parsedInput: { comment, trackID, commentID } }) => {
    try {
      const existingComment = await db.query.comments.findFirst({
        where: and(eq(comments.trackID, trackID), eq(comments.id, commentID)),
      });

      if (!existingComment) {
        return { error: "Comment not found" };
      }

      if (existingComment?.comment === comment) {
        return;
      }

      await db
        .update(comments)
        .set({
          comment,
        })
        .where(and(eq(comments.trackID, trackID), eq(comments.id, commentID)));

      revalidatePath(`/listen?t=${trackID}`);

      return { success: "Comment Updated" };
    } catch (err) {
      console.log(err);
      return { error: "Failed to edit comment" };
    }
  });
