"use client";

import { timeFormat } from "@/lib/time-format";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { useSidebar } from "../ui/sidebar";
import { TrackType } from "@/types/common-types";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { EditIcon, LinkIcon, MoreVertical, Trash2 } from "lucide-react";
import {
  DeleteTrackDialog,
  DeleteTrackDialogTrigger,
} from "./delete-track-dialog";
import { useRouter } from "next/navigation";
import { copyToClipboard } from "@/lib/copy-to-clipboard";
import { Session } from "next-auth";
import { formatNumber } from "@/lib/format-number";

export default function Tracks({
  tracks,
  className,
  openClassName,
  session,
}: {
  tracks: TrackType[];
  className?: string;
  openClassName?: string;
  session: Session | undefined | null;
}) {
  const { open } = useSidebar();
  const router = useRouter();

  if (!tracks.length) {
    return <div>Looks like this user hasn&apos;t uploaded anything.</div>;
  }

  return (
    <div
      className={cn(
        "grid gap-8 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        className,
        open
          ? `md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${openClassName ?? ""}`
          : null
      )}
    >
      {tracks.map((track) => (
        <div key={track.id} className="flex flex-col items-center gap-2">
          <div className="relative w-full">
            <Link href={`/listen?t=${track.id}`} className="w-full">
              <Image
                loading="lazy"
                className="aspect-square object-cover rounded-lg w-full pointer-events-none shadow-2xl"
                src={track.albumCover.imageURL}
                alt={track.trackName}
                width={640}
                height={640}
              />
              <Badge
                variant={"secondary"}
                className="absolute top-full left-full -translate-y-16/14 -translate-x-25/24 z-1 px-1 scale-95"
              >
                {timeFormat(track.duration)}
              </Badge>
            </Link>
          </div>
          <div className="flex flex-col w-full gap-1">
            <div className="flex w-full items-start justify-between">
              <h2 className="text-sm font-bold">{track.trackName}</h2>
              <DeleteTrackDialog session={session} currentTrack={track}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-black dark:text-muted-foreground h-6 w-6"
                    >
                      <MoreVertical className="scale-95" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="left">
                    <DropdownMenuItem
                      className="cursor-pointer text-foreground text-xs transition-colors duration-200"
                      onClick={() =>
                        copyToClipboard(
                          `https://waves-reimagined.vercel.app/listen?t=${track.id}`
                        )
                      }
                    >
                      Copy URL <LinkIcon />
                    </DropdownMenuItem>

                    {session?.user.id === track.userID && (
                      <DropdownMenuItem
                        className="cursor-pointer text-foreground text-xs transition-colors duration-200"
                        onClick={() => router.push(`edit?t=${track.id}`)}
                      >
                        Edit <EditIcon />
                      </DropdownMenuItem>
                    )}

                    {(session?.user.id === track.userID ||
                      session?.user.role === "admin") && (
                      <DeleteTrackDialogTrigger className="w-full">
                        <DropdownMenuItem className="cursor-pointer text-foreground text-xs focus:bg-destructive/25 dark:focus:bg-destructive/20 transition-colors duration-200">
                          Delete Track <Trash2 />
                        </DropdownMenuItem>
                      </DeleteTrackDialogTrigger>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </DeleteTrackDialog>
            </div>

            <div className="flex justify-between">
              <Link
                href={`/profile/${track.user?.handle}`}
                target="_blank"
                className="w-fit"
              >
                <h3 className="w-fit text-muted-foreground font-light text-xs hover:underline underline-offset-2">
                  @{track.user?.handle}
                </h3>
              </Link>
              <h3 className="text-muted-foreground font-light text-xs">
                {formatNumber(track.views)} views
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
