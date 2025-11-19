import Tracks from "@/components/tracks/tracks";
import { db } from "@/server";
import { auth } from "@/server/auth";
import { soundTracks } from "@/server/schema";
import { eq, ne } from "drizzle-orm";

export default async function Home() {
  const session = await auth();

  if (session?.user.role === "admin") {
    const tracks = await db.query.soundTracks.findMany({
      limit: 200,
      with: { albumCover: true, user: true },
      where: ne(soundTracks.visibility, "private"),
      orderBy: (soundTracks, { desc }) => desc(soundTracks.uploadedOn),
    });
    return (
      <Tracks
        tracks={tracks}
        className="2xl:grid-cols-6"
        openClassName="2xl:grid-cols-5"
        session={session}
        isPlaylist
      />
    );
  }

  const tracks = await db.query.soundTracks.findMany({
    limit: 200,
    with: { albumCover: true, user: true },
    where: eq(soundTracks.visibility, "public"),
    orderBy: (soundTracks, { desc }) => desc(soundTracks.uploadedOn),
  });
  return (
    <Tracks
      tracks={tracks}
      className="2xl:grid-cols-6"
      openClassName="2xl:grid-cols-5"
      session={session}
    />
  );
}
