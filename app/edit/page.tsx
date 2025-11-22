import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import EditForm from "./edit-form";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { soundTracks } from "@/server/schema";
import { NotFoundMessage } from "@/components/ui/not-found-message";

export default async function Upload({
  searchParams,
}: {
  searchParams: Promise<{ t: string }>;
}) {
  const parameters = await searchParams;
  const trackID = parameters.t;

  const session = await auth();

  if (!session || !trackID) {
    redirect("/");
  }

  const soundTrack = await db.query.soundTracks.findFirst({
    where: eq(soundTracks.id, trackID),
    with: { albumCover: true, trackTags: true, user: true },
  });

  if (!soundTrack) {
    return (
      <NotFoundMessage>
        This track couldn&apos;t be found or doesn&apos;t belong to you
      </NotFoundMessage>
    );
  }

  if (soundTrack.userID !== session.user.id && session.user.role !== "admin") {
    return (
      <NotFoundMessage>
        This track couldn&apos;t be found or doesn&apos;t belong to you
      </NotFoundMessage>
    );
  }

  return <EditForm soundTrack={soundTrack} />;
}
