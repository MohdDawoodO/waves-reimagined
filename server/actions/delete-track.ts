"use server";

import { createSafeActionClient } from "next-safe-action";
import z from "zod";
import { db } from "..";
import { eq } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";
import { soundTracks } from "../schema";

const action = createSafeActionClient();

export const deleteTrack = action
  .inputSchema(z.object({ trackID: z.string() }))
  .action(async ({ parsedInput: { trackID } }) => {
    try {
      const deletingTrack = await db.query.soundTracks.findFirst({
        where: eq(soundTracks.id, trackID),
        with: { albumCover: true },
      });

      if (!deletingTrack) {
        return { error: "This track does not exist or does not belong to you" };
      }

      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME!,
        api_key: process.env.CLOUDINARY_API_KEY!,
        api_secret: process.env.CLOUDINARY_API_SECRET!,
      });

      await cloudinary.uploader.destroy(deletingTrack.publicID, {
        resource_type: "video",
      });

      await cloudinary.uploader.destroy(deletingTrack.albumCover.publicID);

      await db.delete(soundTracks).where(eq(soundTracks.id, trackID));

      return { success: "Track Deleted" };
    } catch (err) {
      return { error: "something went wrong" };
    }
  });
