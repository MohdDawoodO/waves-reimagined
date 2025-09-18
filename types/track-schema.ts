import z from "zod";

export const TrackSchema = z.object({
  userID: z.string(),
  name: z
    .string()
    .min(3, { error: "Track name must be at least 4 characters long" })
    .max(30, { error: "Track name can be no longer than 30 characters" }),
  description: z
    .string()
    .min(10, { error: "Description must be at least 10 characters long" })
    .max(50, { error: "Description can be no longer than 50 characters" }),
  tags: z.array(z.string()),
  trackURL: z.string(),
  publicID: z.string(),
  albumCover: z.string(),
});
