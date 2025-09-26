"use client";

import { useEffect, useRef, useState } from "react";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { ChevronFirstIcon, ChevronLast, Pause, Play } from "lucide-react";
import { timeFormat } from "@/lib/time-format";
import { usePathname, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { suggestedTrackIDs } from "@/lib/states";
import { AllTracksType } from "@/types/common-types";

export default function TrackControls({
  tracks,
  trackURL,
  duration,
}: {
  tracks: AllTracksType;
  trackURL: string;
  duration: number;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const [index, setIndex] = useState(0);

  const [trackIDs, setTrackIDs] = useAtom(suggestedTrackIDs);

  function playSongHandler() {
    if (isPlaying) {
      setIsPlaying(false);
      audioRef.current?.pause();
      return;
    }

    audioRef.current?.play();
    setIsPlaying(true);
  }

  function previousSong() {
    if (index - 1 < 0) {
      router.push(`/listen?t=${trackIDs[trackIDs.length - 1]}`);
      setIndex(trackIDs.length - 1);
    } else {
      router.push(`/listen?t=${trackIDs[index - 1]}`);
      setIndex(index - 1);
    }
  }

  function nextSong() {
    if (index + 1 < trackIDs.length) {
      router.push(`/listen?t=${trackIDs[index + 1]}`);
      setIndex(index + 1);
    }
    if (index + 1 === trackIDs.length) {
      router.push(`/listen?t=${trackIDs[0]}`);
      setIndex(0);
    }
  }

  //* Runs only once to set autoPlay tracks
  useEffect(() => {
    setTrackIDs(tracks.map((track) => track.id));
    // eslint-disable-next-line
  }, [setTrackIDs]);

  useEffect(() => {
    const promise = audioRef.current?.play();
    promise?.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [trackURL, pathname]);

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-4">
      <div className="w-full flex gap-4 text-xs text-black dark:text-muted-foreground">
        <p>{timeFormat(currentDuration)}</p>
        <Slider
          value={[currentDuration]}
          step={0.01}
          max={duration}
          onValueChange={(value) => {
            if (audioRef.current) audioRef.current.currentTime = value[0];
          }}
        />
        <p>{timeFormat(duration)}</p>
      </div>
      <div className="flex gap-4">
        <Button variant="ghost" size="icon" onClick={() => previousSong()}>
          <ChevronFirstIcon className="text-black dark:text-muted-foreground stroke-3 scale-115" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => playSongHandler()}>
          {isPlaying ? (
            <Pause className="text-black dark:text-muted-foreground fill-muted-foreground scale-115" />
          ) : (
            <Play className="text-black dark:text-muted-foreground fill-muted-foreground scale-115" />
          )}
        </Button>
        <Button variant="ghost" size="icon" onClick={() => nextSong()}>
          <ChevronLast className="text-black dark:text-muted-foreground stroke-3 scale-115" />
        </Button>
      </div>

      <audio
        src={trackURL}
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentDuration(e.currentTarget.currentTime)}
        onEnded={() => nextSong()}
      />
    </div>
  );
}
