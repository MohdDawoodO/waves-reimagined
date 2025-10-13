"use client";

import { Badge } from "@/components/ui/badge";
import { useSidebar } from "@/components/ui/sidebar";
import { formatNumber } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import {
  PlaylistTrackType,
  PlaylistType,
  TrackType,
  UserType,
} from "@/types/common-types";
import Image from "next/image";
import Link from "next/link";
import { TbPlaylistAdd } from "react-icons/tb";

export default function Playlists({
  playlists,
}: {
  playlists: (PlaylistType & {
    playlistTracks: (PlaylistTrackType & { track: TrackType })[];
    user: UserType;
  })[];
}) {
  const { open } = useSidebar();

  if (!playlists.length) {
    return <div>Looks like this user hasn&apos;t made any playlists.</div>;
  }

  return (
    <div
      className={cn(
        "grid gap-8 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
        open
          ? `md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`
          : null
      )}
    >
      {playlists.map((playlist) => (
        <Playlist
          id={playlist.id}
          imageURL={
            playlist.playlistTracks[0]?.track.albumCover.imageURL || undefined
          }
          name={playlist.name}
          userHandle={playlist.user.handle!}
          key={playlist.id}
          tracks={playlist.tracks}
        />
      ))}
    </div>
  );
}

function Playlist({
  id,
  imageURL,
  name,
  userHandle,
  tracks,
}: {
  id: string;
  imageURL?: string | undefined;
  name: string;
  userHandle: string;
  tracks: number;
}) {
  return (
    <Link
      key={id}
      href={`/playlist?list=${id}`}
      className="flex flex-col items-center gap-2"
    >
      <div className="relative w-full">
        {imageURL && (
          <Image
            loading="lazy"
            className="aspect-square object-cover rounded-lg w-full pointer-events-none shadow-2xl brightness-75"
            src={imageURL}
            alt={name}
            width={640}
            height={640}
          />
        )}
        {!imageURL && (
          <>
            <div className="bg-muted-foreground/15 w-full aspect-square rounded-lg" />
            <TbPlaylistAdd
              className="p-2 rounded-full bg-black/50 absolute top-1/2 left-1/2 -translate-1/2"
              size={64}
            />
          </>
        )}

        <Badge
          variant="secondary"
          className="absolute top-full left-full -translate-y-16/14 -translate-x-25/24"
        >
          {formatNumber(tracks)} Tracks
        </Badge>
        <div className="absolute w-full h-full top-0 left-0 bg-black/25 rounded-lg" />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex w-full items-start justify-between gap-2">
          <h2 className="text-sm font-bold">{name}</h2>
          {/* action dropdown */}
        </div>
        <div>
          <h3 className="w-fit text-muted-foreground font-light text-xs">
            @{userHandle}
          </h3>
        </div>
      </div>
    </Link>
  );
}
