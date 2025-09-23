import AllTracks from "@/components/tracks/all-tracks";
import { db } from "@/server";
import { soundTracks } from "@/server/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  const tracks = await db.query.soundTracks.findMany({
    limit: 200,
    with: { albumCover: true, user: true },
    where: eq(soundTracks.visibility, "public"),
    orderBy: (soundTracks, { desc }) => desc(soundTracks.uploadedOn),
  });

  return <AllTracks tracks={tracks} />;
}
