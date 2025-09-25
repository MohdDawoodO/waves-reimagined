"use client";

import { timeFormat } from "@/lib/time-format";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { useSidebar } from "../ui/sidebar";
import { AllTracksType } from "@/types/common-types";
import Link from "next/link";

export default function Tracks({
  tracks,
  className,
  openClassName,
}: {
  tracks: AllTracksType;
  className?: string;
  openClassName?: string;
}) {
  const { open } = useSidebar();

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
        <Link
          key={track.id}
          href={`/listen?t=${track.id}`}
          className="flex flex-col items-center gap-2"
        >
          <Image
            loading="lazy"
            className="aspect-square object-cover rounded-lg w-full pointer-events-none shadow-2xl"
            src={track.albumCover.imageURL}
            alt={track.trackName}
            width={640}
            height={640}
          />
          <div className="flex flex-col w-full">
            <div className="flex w-full items-start justify-between gap-2">
              <h2 className="text-sm font-bold">{track.trackName}</h2>
              <Badge variant={"secondary"} className="scale-95">
                {timeFormat(track.duration)}
              </Badge>
            </div>
            <div>
              <h3 className="w-fit text-muted-foreground font-light text-xs">
                @{track.user.handle}
              </h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
