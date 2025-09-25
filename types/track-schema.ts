import z from "zod";

export const TrackSchema = z.object({
  userID: z.string(),
  name: z
    .string()
    .min(3, { error: "Track name must be at least 4 characters long" })
    .max(30, { error: "Track name can be no longer than 30 characters" }),
  description: z
    .string()
    .max(200, { error: "Description can be no longer than 200 characters" }),
  tags: z
    .array(z.string())
    .min(1, { error: "Please add at least 1 tag" })
    .max(10, { error: "You can add no more than 10 tags" }),
  albumCover: z.object({
    imageURL: z.string(),
    publicID: z.string().optional(),
  }),
  soundTrack: z.object({
    trackURL: z.string(),
    publicID: z.string().optional(),
  }),
  duration: z.number(),
  visibility: z.enum(["public", "unlisted", "private"]),
});
