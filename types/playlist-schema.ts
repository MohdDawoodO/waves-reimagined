import z from "zod";

export const PlaylistSchema = z.object({
  userID: z.string(),
  name: z
    .string()
    .min(3, { error: "Playlist name must be 3 or more characters" })
    .max(30, { error: "Playlist name can be no more than 30 characters" }),
  description: z
    .string()
    .max(200, { error: "Description can be no more than 200 characters" }),
  visibility: z.enum(["public", "unlisted", "private"]),
});
