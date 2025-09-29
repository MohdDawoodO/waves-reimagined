import TrackComments from "@/components/tracks/track-comments";
import TrackControls from "@/components/tracks/track-controls";
import TrackCover from "@/components/tracks/track-cover";
import TrackDescription from "@/components/tracks/track-description";
import Tracks from "@/components/tracks/tracks";
import { NotFoundMessage } from "@/components/ui/not-found-message";
import { db } from "@/server";
import { auth } from "@/server/auth";
import { soundTracks } from "@/server/schema";
import { and, eq, ne } from "drizzle-orm";

import { redirect } from "next/navigation";

export default async function Listen({
  searchParams,
}: {
  searchParams: Promise<{ t: string }>;
}) {
  const parameters = await searchParams;
  const trackID = parameters.t;

  if (!trackID) redirect("/");

  const soundTrack = await db.query.soundTracks.findFirst({
    where: and(
      eq(soundTracks.id, trackID),
      ne(soundTracks.visibility, "private")
    ),
    with: { albumCover: true, user: true },
  });

  const session = await auth();

  if (!soundTrack)
    return (
      <NotFoundMessage>This track is either private or deleted</NotFoundMessage>
    );

  const userTracks = await db.query.soundTracks.findMany({
    where: and(
      eq(soundTracks.userID, soundTrack.userID),
      eq(soundTracks.visibility, "public"),
      ne(soundTracks.id, soundTrack.id)
    ),
    with: { albumCover: true, user: true },
    limit: 5,
    orderBy: (soundTracks, { desc }) => desc(soundTracks.uploadedOn),
  });

  const otherTracks = await db.query.soundTracks.findMany({
    where: and(
      ne(soundTracks.userID, soundTrack.userID),
      eq(soundTracks.visibility, "public")
    ),
    with: { albumCover: true, user: true },
    limit: 50,
    orderBy: (soundTracks, { desc }) => desc(soundTracks.uploadedOn),
  });

  const suggestedTracks = [...userTracks, ...otherTracks];

  return (
    <div className="flex flex-col 2xl:flex-row gap-24 2xl:gap-0">
      <div className="min-h-[80vh] flex-5 flex flex-col items-center gap-20">
        <div className="w-full flex flex-col items-center gap-8">
          <TrackCover
            albumCover={soundTrack.albumCover.imageURL}
            trackName={soundTrack.trackName}
            userHandle={soundTrack.user.handle!}
          />
          <TrackControls
            tracks={[soundTrack, ...suggestedTracks]}
            trackURL={soundTrack.trackURL}
            duration={soundTrack.duration}
            session={session}
          />
        </div>
        <div className="flex flex-col w-full items-center gap-8">
          <TrackDescription
            uploadedOn={soundTrack.uploadedOn}
            description={soundTrack.description}
          />
          <TrackComments />
        </div>
      </div>
      <div className="flex-1">
        <Tracks tracks={suggestedTracks} className="2xl:grid-cols-1" />
      </div>
    </div>
  );
}
