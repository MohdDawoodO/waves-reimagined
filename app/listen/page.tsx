import TrackControls from "@/components/tracks/track-controls";
import TrackCover from "@/components/tracks/track-cover";
import Tracks from "@/components/tracks/tracks";
import { db } from "@/server";
import { soundTracks } from "@/server/schema";
import { and, eq, ne } from "drizzle-orm";

export default async function Listen({
  searchParams,
}: {
  searchParams: Promise<{ t: string }>;
}) {
  const parameters = await searchParams;
  const trackID = parameters.t;

  const soundTrack = await db.query.soundTracks.findFirst({
    where: and(
      eq(soundTracks.id, trackID),
      ne(soundTracks.visibility, "private")
    ),
    with: { albumCover: true, user: true },
  });

  if (!soundTrack) return <div>No track found</div>;

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
    limit: 15,
    orderBy: (soundTracks, { desc }) => desc(soundTracks.uploadedOn),
  });

  const suggestedTracks = [...userTracks, ...otherTracks];

  return (
    <div className="flex flex-col 2xl:flex-row">
      <div className="min-h-[80vh] flex-5 flex flex-col items-center gap-8">
        <TrackCover
          albumCover={soundTrack.albumCover.imageURL!}
          trackName={soundTrack.trackName!}
          userHandle={soundTrack.user.handle!}
        />
        <TrackControls
          trackURL={soundTrack.trackURL}
          duration={soundTrack.duration}
        />
      </div>
      <div className="flex-1">
        <Tracks tracks={suggestedTracks} className="2xl:grid-cols-1" />
      </div>
    </div>
  );
}
