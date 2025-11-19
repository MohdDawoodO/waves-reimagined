import { NotFoundMessage } from "@/components/ui/not-found-message";
import { db } from "@/server";
import { playlists } from "@/server/schema";
import { and, eq, ne } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function ViewPlaylist({
  params,
  searchParams,
}: {
  params: Promise<{ list: string }>;
  searchParams: Promise<{ index: string }>;
}) {
  const parameter = await params;
  const searchParameter = await searchParams;
  const list = parameter.list;
  const index = Number(searchParameter.index);

  if (!list) redirect("/");

  const playlist = await db.query.playlists.findFirst({
    where: and(eq(playlists.id, list), ne(playlists.visibility, "private")),
    with: {
      playlistTracks: { with: { track: { with: { albumCover: true } } } },
    },
  });

  if (!playlist) {
    return (
      <NotFoundMessage>
        This playlist is either private or deleted
      </NotFoundMessage>
    );
  }

  if (!index || index <= 0 || index > playlist?.playlistTracks.length)
    redirect(`/playlist/${list}?index=1`);

  return (
    <div>
      <h2>{list}</h2>
      <h3>{index}</h3>
    </div>
  );
}
