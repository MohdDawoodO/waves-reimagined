"use client";

import CreatePlaylistForm from "@/components/playlist/create-playlist-form";
import PlaylistActions from "@/components/playlist/playlist-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSidebar } from "@/components/ui/sidebar";
import { formatNumber } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { DisplayPlaylistType } from "@/types/common-types";
import { DialogClose } from "@radix-ui/react-dialog";
import { PlusCircle } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { TbPlaylist } from "react-icons/tb";

export default function Playlists({
  playlists,
  session,
  userHandle,
}: {
  playlists: DisplayPlaylistType[];
  session: Session | null | undefined;
  userHandle: string;
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
        <Playlist key={playlist.id} session={session} playlist={playlist} />
      ))}

      {session && session.user.handle === userHandle && (
        <Dialog>
          <div className="flex flex-col items-center gap-2">
            <DialogTrigger className="w-full cursor-pointer">
              <div className="relative w-full">
                <div className="bg-muted-foreground/15 w-full aspect-square rounded-lg" />

                <PlusCircle
                  className="p-2 rounded-full  text-white absolute top-1/2 left-1/2 -translate-1/2 z-1"
                  size={64}
                />

                <div className="absolute w-full h-full top-0 left-0 bg-black/35 rounded-lg" />
              </div>
            </DialogTrigger>

            <div className="flex justify-between w-full gap-2">
              <div className="flex flex-col w-full items-start justify-between">
                <h2 className="text-sm font-bold">Create new playlist</h2>
              </div>
            </div>
          </div>
          <DialogContent className="px-4 md:px-6">
            <DialogHeader className="mb-4">
              <DialogTitle>Create new Playlist</DialogTitle>
            </DialogHeader>
            <CreatePlaylistForm userID={session.user.id} />

            <DialogFooter>
              <DialogClose asChild>
                <Button>Done</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function Playlist({
  session,
  playlist,
}: {
  session: Session | null | undefined;
  playlist: DisplayPlaylistType;
}) {
  return (
    <div key={playlist.id} className="flex flex-col items-center gap-2">
      <div className="relative w-full">
        <Link
          href={`/playlist?list=${playlist.id}`}
          className={
            playlist.latestTrackCover ? "cursor-pointer" : "cursor-auto"
          }
          onClick={(e) => {
            if (!playlist.latestTrackCover) {
              e.preventDefault();
            }
          }}
        >
          {playlist.latestTrackCover && (
            <Image
              loading="lazy"
              className="aspect-square object-cover rounded-lg w-full pointer-events-none shadow-2xl brightness-75"
              src={playlist.latestTrackCover}
              alt={playlist.name}
              width={640}
              height={640}
            />
          )}
          {!playlist.latestTrackCover && (
            <>
              <div className="bg-muted-foreground/15 w-full aspect-square rounded-lg" />
              <TbPlaylist
                className="p-2 rounded-full bg-black/50 text-white absolute top-1/2 left-1/2 -translate-1/2 z-1"
                size={64}
              />
            </>
          )}

          <Badge
            variant="secondary"
            className="absolute top-full left-full -translate-y-16/13 -translate-x-25/23 z-1 px-1"
          >
            {formatNumber(playlist.tracks)} Tracks
          </Badge>
          <div className="absolute w-full h-full top-0 left-0 bg-black/25 rounded-lg" />
        </Link>
      </div>
      <div className="flex justify-between w-full gap-2">
        <div className="flex flex-col w-full items-start justify-between">
          <h2 className="text-sm font-bold">{playlist.name}</h2>
          <Link href={`/profile/${playlist.userHandle}`} target="_blank">
            <h3 className="w-fit text-muted-foreground font-light text-xs hover:underline underline-offset-2">
              @{playlist.userHandle}
            </h3>
          </Link>
        </div>
        <div>
          <PlaylistActions session={session} playlist={playlist} />
        </div>
      </div>
    </div>
  );
}
