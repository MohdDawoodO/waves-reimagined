"use client";

import Image from "next/image";
import Link from "next/link";

export default function TrackCover({
  trackName,
  albumCover,
  userHandle,
}: {
  trackName: string;
  albumCover: string;
  userHandle: string;
}) {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <Image
        width={720}
        height={720}
        src={albumCover}
        alt={trackName}
        className="pointer-events-none rounded-lg shadow-2xl aspect-square object-cover w-sm"
      />
      <div className="flex items-center flex-col">
        <h2 className="text-base font-bold">{trackName}</h2>
        <Link
          href={`/profile/${userHandle}/home`}
          className="text-sm font-bold text-muted-foreground hover:underline underline-offset-2"
        >
          @{userHandle}
        </Link>
      </div>
    </div>
  );
}
