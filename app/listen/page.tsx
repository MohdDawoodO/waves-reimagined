import TrackComments from "@/components/tracks/track-comments";
import TrackControls from "@/components/tracks/track-controls";
import TrackCover from "@/components/tracks/track-cover";
import TrackDescription from "@/components/tracks/track-description";
import Tracks from "@/components/tracks/tracks";
import { NotFoundMessage } from "@/components/ui/not-found-message";
import { db } from "@/server";
import { auth } from "@/server/auth";
import { likes, playlists, playlistTracks, soundTracks } from "@/server/schema";
import {
  LikeType,
  PlaylistTrackType,
  PlaylistWithTrackType,
  TrackType,
} from "@/types/common-types";
import { and, eq, ne } from "drizzle-orm";

import { redirect } from "next/navigation";

export default async function Listen({
  searchParams,
}: {
  searchParams: Promise<{ t: string }>;
}) {
  const parameters = await searchParams;
  const trackID = parameters.t;

  let otherTracks: TrackType[] = [];
  let userTracks: TrackType[] = [];
  let like: LikeType | undefined = undefined;
  let bookmarked: PlaylistTrackType | undefined = undefined;
  let userPlaylists: PlaylistWithTrackType[] = [];

  if (!trackID) redirect("/");

  const soundTrack = await db.query.soundTracks.findFirst({
    where: and(
      eq(soundTracks.id, trackID),
      ne(soundTracks.visibility, "private")
    ),
    with: {
      albumCover: true,
      user: true,
      like: true,
      trackComments: {
        with: { commentUser: true },
        orderBy: (comments, { desc }) => desc(comments.commentedOn),
      },
    },
  });

  const session = await auth();

  if (!soundTrack)
    return (
      <NotFoundMessage>This track is either private or deleted</NotFoundMessage>
    );

  if (session?.user.role === "admin") {
    userTracks = await db.query.soundTracks.findMany({
      where: and(
        eq(soundTracks.userID, soundTrack.userID),
        ne(soundTracks.visibility, "private"),
        ne(soundTracks.id, soundTrack.id)
      ),
      with: { albumCover: true, user: true },
      limit: 5,
      orderBy: (soundTracks, { desc }) => desc(soundTracks.uploadedOn),
    });

    otherTracks = await db.query.soundTracks.findMany({
      where: and(
        ne(soundTracks.userID, soundTrack.userID),
        ne(soundTracks.visibility, "private")
      ),
      with: { albumCover: true, user: true },
      limit: 50,
      orderBy: (soundTracks, { desc }) => desc(soundTracks.uploadedOn),
    });
  } else {
    userTracks = await db.query.soundTracks.findMany({
      where: and(
        eq(soundTracks.userID, soundTrack.userID),
        eq(soundTracks.visibility, "public"),
        ne(soundTracks.id, soundTrack.id)
      ),
      with: { albumCover: true, user: true },
      limit: 5,
      orderBy: (soundTracks, { desc }) => desc(soundTracks.uploadedOn),
    });

    otherTracks = await db.query.soundTracks.findMany({
      where: and(
        ne(soundTracks.userID, soundTrack.userID),
        eq(soundTracks.visibility, "public")
      ),
      with: { albumCover: true, user: true },
      limit: 50,
      orderBy: (soundTracks, { desc }) => desc(soundTracks.uploadedOn),
    });
  }

  if (session) {
    like = await db.query.likes.findFirst({
      where: and(eq(likes.userID, session.user.id), eq(likes.trackID, trackID)),
    });

    userPlaylists = await db.query.playlists.findMany({
      where: eq(playlists.userID, session.user.id),
      with: { playlistTracks: { where: eq(playlistTracks.trackID, trackID) } },
    });

    const watchLaterPlaylist = userPlaylists.filter(
      (playlist) => playlist.name === "Watch Later"
    )[0];

    if (!watchLaterPlaylist) return;

    bookmarked = await db.query.playlistTracks.findFirst({
      where: and(
        eq(playlistTracks.playlistID, watchLaterPlaylist.id),
        eq(playlistTracks.trackID, trackID)
      ),
    });
  }

  const suggestedTracks = [...userTracks, ...otherTracks];

  return (
    <div className="flex flex-col 2xl:flex-row gap-24 2xl:gap-0">
      <div className="min-h-[80vh] flex-5 flex flex-col items-center pt-4 md:pt-0 gap-20">
        <div className="w-full flex flex-col items-center gap-8">
          <TrackCover
            albumCover={soundTrack.albumCover.imageURL}
            trackName={soundTrack.trackName}
            userHandle={soundTrack.user.handle!}
          />
          <TrackControls
            tracks={[soundTrack, ...suggestedTracks]}
            isLiked={!!like}
            isBookmarked={!!bookmarked}
            session={session}
            userPlaylists={userPlaylists}
          />
        </div>
        <div className="flex flex-col w-full items-center gap-12">
          <TrackDescription
            uploadedOn={soundTrack.uploadedOn}
            description={soundTrack.description}
          />
          <TrackComments
            trackID={soundTrack.id}
            comments={soundTrack.trackComments}
            session={session}
            trackOwnerHandle={soundTrack.user.handle!}
          />
        </div>
      </div>
      <div className="flex-1">
        <Tracks tracks={suggestedTracks} className="2xl:grid-cols-1" />
      </div>
    </div>
  );
}
