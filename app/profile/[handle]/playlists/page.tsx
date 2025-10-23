import { db } from "@/server";
import { likes, playlists, users } from "@/server/schema";
import { and, eq, ne } from "drizzle-orm";

import Playlists from "./playlists";
import { auth } from "@/server/auth";

export default async function UserPlaylists({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const parameter = await params;

  const user = await db.query.users.findFirst({
    where: eq(users.handle, parameter.handle),
  });

  const session = await auth();

  if (!user) return;

  if (session?.user.handle === parameter.handle) {
    const userPlaylists = await db.query.playlists.findMany({
      where: eq(playlists.userID, user.id),
      with: {
        playlistTracks: {
          orderBy: (playlistTracks, { desc }) => desc(playlistTracks.id),
          limit: 1,
          with: { track: { with: { albumCover: true } } },
        },
        user: true,
      },
      orderBy: (playlists, { desc }) => desc(playlists.createdOn),
    });

    const playlistsData = userPlaylists.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      tracks: playlist.tracks,
      editable: playlist.editable,
      visibility: playlist.visibility as "private" | "unlisted" | "public",
      latestTrackCover: playlist.playlistTracks[0]
        ? playlist.playlistTracks[0].track.albumCover.imageURL
        : undefined,
      userHandle: playlist.user.handle,
    }));

    const likedTracks = await db.query.likes.findMany({
      where: eq(likes.userID, user.id),
      orderBy: (like, { desc }) => desc(like.id),
      with: { soundTrack: { with: { albumCover: true } }, user: true },
    });

    const allPlaylists = [
      ...playlistsData,
      {
        id: "liked",
        name: "Liked Tracks",
        description: "",
        tracks: likedTracks.length,
        editable: false,
        visibility: "private" as "private" | "unlisted" | "public",
        latestTrackCover: likedTracks[0]
          ? likedTracks[0].soundTrack.albumCover.imageURL
          : undefined,
        userHandle: parameter.handle,
      },
    ];

    //* implement likes as a playlist

    return (
      <Playlists
        playlists={allPlaylists}
        session={session}
        userHandle={parameter.handle}
      />
    );
  }

  if (session?.user.role === "admin") {
    const adminPlaylists = await db.query.playlists.findMany({
      where: and(
        eq(playlists.userID, user.id),
        ne(playlists.visibility, "private")
      ),
      with: {
        playlistTracks: {
          orderBy: (playlistTracks, { desc }) => desc(playlistTracks.id),
          limit: 1,
          with: { track: { with: { albumCover: true } } },
        },
        user: true,
      },
      orderBy: (playlists, { desc }) => desc(playlists.createdOn),
    });

    const playlistsData = adminPlaylists.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      tracks: playlist.tracks,
      editable: playlist.editable,
      visibility: playlist.visibility as "private" | "unlisted" | "public",
      latestTrackCover: playlist.playlistTracks[0]
        ? playlist.playlistTracks[0].track.albumCover.imageURL
        : undefined,
      userHandle: playlist.user.handle,
    }));

    return (
      <Playlists
        playlists={[...playlistsData]}
        session={session}
        userHandle={parameter.handle}
      />
    );
  }

  if (session?.user.handle !== parameter.handle) {
    const publicPlaylists = await db.query.playlists.findMany({
      where: and(
        eq(playlists.userID, user.id),
        eq(playlists.visibility, "public")
      ),
      with: {
        playlistTracks: {
          orderBy: (playlistTracks, { desc }) => desc(playlistTracks.id),
          limit: 1,
          with: { track: { with: { albumCover: true } } },
        },
        user: true,
      },
      orderBy: (playlists, { desc }) => desc(playlists.createdOn),
    });

    const playlistsData = publicPlaylists.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      tracks: playlist.tracks,
      editable: playlist.editable,
      visibility: playlist.visibility as "private" | "unlisted" | "public",
      latestTrackCover: playlist.playlistTracks[0]
        ? playlist.playlistTracks[0].track.albumCover.imageURL
        : undefined,
      userHandle: playlist.user.handle,
    }));

    return (
      <Playlists
        playlists={playlistsData}
        session={session}
        userHandle={parameter.handle}
      />
    );
  }
}
