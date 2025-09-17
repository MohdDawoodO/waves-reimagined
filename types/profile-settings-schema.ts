import z from "zod";

export const ProfileSettingsSchema = z.object({
  userID: z.string(),
  displayName: z
    .string()
    .min(3, { error: "Display name must be at least 3 characters long" }),
  profileDescription: z
    .string()
    .max(100, {
      error: "Profile description must be 200 characters or fewer.",
    })
    .optional(),
  avatar: z.string().optional(),
  // keepLikedVideosPrivate: z.boolean(), //? for some time only, till playlists are added
});
