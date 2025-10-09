import z from "zod";

export const EditCommentSchema = z.object({
  commentID: z.number(),
  trackID: z.string(),
  comment: z
    .string()
    .min(1, { error: "" })
    .max(200, { error: "Comment can be no more than 200 charactere" }),
});
