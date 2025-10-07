"use server";

import { UpdateTrackSchema } from "@/types/update-track-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { albumCovers, soundTracks, trackTags } from "../schema";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const updateTrack = action
  .inputSchema(UpdateTrackSchema)
  .action(
    async ({
      parsedInput: { trackID, name, description, albumCover, tags, visibility },
    }) => {
      try {
        const soundTrack = await db.query.soundTracks.findFirst({
          where: eq(soundTracks.id, trackID),
          with: { albumCover: true },
        });

        if (!soundTrack) return { error: "Track not found" };

        if (soundTrack.albumCover.imageURL !== albumCover.imageURL) {
          cloudinary.config({
            cloud_name: process.env.CLOUD_NAME!,
            api_key: process.env.CLOUDINARY_API_KEY!,
            api_secret: process.env.CLOUDINARY_API_SECRET!,
          });

          cloudinary.uploader.destroy(soundTrack.albumCover.publicID, {
            resource_type: "image",
          });

          // delete fn to be added

          await db
            .update(albumCovers)
            .set({
              imageURL: albumCover.imageURL,
              publicID: albumCover.publicID,
            })
            .where(eq(albumCovers.trackID, trackID));
        }

        await db.delete(trackTags).where(eq(trackTags.trackID, trackID));

        tags.map(
          async (tag) => await db.insert(trackTags).values({ tag, trackID })
        );

        await db
          .update(soundTracks)
          .set({
            trackName: name,
            description,
            visibility,
          })
          .where(eq(soundTracks.id, trackID));

        revalidatePath(`/edit/t=${trackID}`);

        return { success: "Track Updated" };
      } catch (err) {
        console.log(err);
        return { error: "Something went wrong" };
      }
    }
  );
