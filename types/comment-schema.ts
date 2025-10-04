import z from "zod";

export const CommentSchema = z.object({
  userID: z.string(),
  trackID: z.string(),
  comment: z
    .string()
    .min(1, { error: "" })
    .max(200, { error: "Comment can be no more than 200 charactere" }),
});
