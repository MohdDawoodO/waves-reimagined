import Tracks from "@/components/tracks/tracks";
import { db } from "@/server";
import { auth } from "@/server/auth";
import { soundTracks } from "@/server/schema";
import { eq } from "drizzle-orm";

export default async function MostViewed() {
  const session = await auth();

  const tracks = await db.query.soundTracks.findMany({
    limit: 200,
    with: { albumCover: true, user: true },
    where: eq(soundTracks.visibility, "public"),
    orderBy: (soundTracks, { desc }) => desc(soundTracks.views),
  });
  return (
    <Tracks
      session={session}
      tracks={tracks}
      className="2xl:grid-cols-6"
      openClassName="2xl:grid-cols-5"
    />
  );
}
