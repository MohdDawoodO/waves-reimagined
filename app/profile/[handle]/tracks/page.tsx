import Tracks from "@/components/tracks/tracks";
import { db } from "@/server";
import { auth } from "@/server/auth";
import { soundTracks, users } from "@/server/schema";
import { and, eq } from "drizzle-orm";

export default async function UserTracks({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const parameter = await params;
  const session = await auth();

  const user = await db.query.users.findFirst({
    where: eq(users.handle, parameter.handle),
  });

  if (!user) return;

  if (session?.user.handle === parameter.handle) {
    const userTracks = await db.query.soundTracks.findMany({
      where: eq(soundTracks.userID, user.id),
      with: { albumCover: true, user: true },
    });

    return <Tracks tracks={userTracks} />;
  }

  if (session?.user.handle !== parameter.handle) {
    const publicTracks = await db.query.soundTracks.findMany({
      where: and(
        eq(soundTracks.userID, user.id),
        eq(soundTracks.visibility, "public")
      ),
      with: { albumCover: true, user: true },
    });

    return (
      <Tracks
        tracks={publicTracks}
        className="2xl:grid-cols-6"
        openClassName="2xl:grid-cols-5"
      />
    );
  }
}
