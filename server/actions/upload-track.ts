"use server";

import { TrackSchema } from "@/types/track-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { albumCovers, soundTracks, trackTags, users } from "../schema";
import { cloudinary } from "@/lib/cloudinary";

const action = createSafeActionClient();

export const uploadTrack = action
  .inputSchema(TrackSchema)
  .action(
    async ({
      parsedInput: {
        name,
        description,
        duration,
        userID,
        tags,
        visibility,
        albumCover,
        soundTrack,
      },
    }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.id, userID),
      });

      if (!user) {
        return { error: "User not found" };
      }

      // track upload

      const cloudTrack = await cloudinary({
        action: "upload",
        file: soundTrack,
        audio: true,
      });

      console.log("fine");

      const uploadedTrack = await db
        .insert(soundTracks)
        .values({
          trackName: name,
          description,
          userID,
          duration,
          visibility,
          trackURL: cloudTrack?.fileURL!,
          publicID: cloudTrack?.fileID!,
        })
        .returning();

      // inserting tags

      tags.map(async (tag) => {
        await db.insert(trackTags).values({
          tag,
          trackID: uploadedTrack[0].id,
        });
      });

      // inserting album cover

      const cloudAlbumCover = await cloudinary({
        action: "upload",
        file: albumCover,
      });

      await db.insert(albumCovers).values({
        imageURL: cloudAlbumCover?.fileURL!,
        publicID: cloudAlbumCover?.fileID!,
        trackID: uploadedTrack[0].id,
      });

      return { success: "Track Uploaded" };
    }
  );
