import { db } from "@/server";
import { playlists, users } from "@/server/schema";
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

    return <Playlists playlists={userPlaylists} />;
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

    return <Playlists playlists={adminPlaylists} />;
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

    return <Playlists playlists={publicPlaylists} />;
  }
}
