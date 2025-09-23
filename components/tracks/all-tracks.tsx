"use client";

import { timeFormat } from "@/lib/time-format";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { useSidebar } from "../ui/sidebar";
import { AllTracksType } from "@/types/common-types";
import Link from "next/link";
import { motion } from "motion/react";

export default function AllTracks({ tracks }: { tracks: AllTracksType }) {
  const { open } = useSidebar();
  const MotionImage = motion.create(Image);
  const MotionBadge = motion.create(Badge);

  if (!tracks.length) {
    return <div>Looks like this user hasn&apos;t uploaded anything.</div>;
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 xs:grid-cols-2 gap-8",
        open
          ? "lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
          : "md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
      )}
    >
      {tracks.map((track) => (
        <Link
          key={track.id}
          href={`/listen?t=${track.id}`}
          className="flex flex-col items-center gap-2"
        >
          <MotionImage
            layoutId={track.id}
            loading="lazy"
            className="aspect-square object-cover rounded-lg w-full pointer-events-none shadow-2xl"
            src={track.albumCover.imageURL}
            alt={track.trackName}
            width={360}
            height={360}
          />
          <div className="flex flex-col w-full">
            <div className="flex w-full items-start justify-between">
              <motion.h2
                layoutId={track.id + "name"}
                className="text-sm font-bold"
              >
                {track.trackName}
              </motion.h2>
              <MotionBadge variant={"secondary"} layoutId={track.id + "badge"}>
                {timeFormat(track.duration)}
              </MotionBadge>
            </div>
            <div className="text-muted-foreground font-extralight relative">
              <motion.h3
                layoutId={track.id + "owner"}
                className="w-fit text-xs"
              >
                @{track.user.handle}
              </motion.h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
