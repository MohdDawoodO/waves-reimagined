"use server";

import { TrackSchema } from "@/types/track-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { albumCovers, soundTracks, trackTags, users } from "../schema";

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
      try {
        const user = await db.query.users.findFirst({
          where: eq(users.id, userID),
        });

        if (!user) {
          return { error: "User not found" };
        }

        // track upload

        const uploadedTrack = await db
          .insert(soundTracks)
          .values({
            trackName: name,
            description,
            userID,
            duration,
            visibility,
            trackURL: soundTrack?.trackURL!,
            publicID: soundTrack?.publicID!,
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

        await db.insert(albumCovers).values({
          imageURL: albumCover?.imageURL!,
          publicID: albumCover?.publicID!,
          trackID: uploadedTrack[0].id,
        });

        return { success: "Track Uploaded" };
      } catch (err) {
        console.log(err);
        return { error: "Failed to upload track" };
      }
    }
  );
