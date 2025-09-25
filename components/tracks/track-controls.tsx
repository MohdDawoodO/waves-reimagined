"use client";

import { useEffect, useRef, useState } from "react";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { ChevronFirstIcon, ChevronLast, Pause, Play } from "lucide-react";
import { timeFormat } from "@/lib/time-format";
import { usePathname } from "next/navigation";

export default function TrackControls({
  trackURL,
  duration,
}: {
  trackURL: string;
  duration: number;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(0);
  const pathname = usePathname();

  function playSongHandler() {
    if (isPlaying) {
      setIsPlaying(false);
      audioRef.current?.pause();
      return;
    }

    audioRef.current?.play();
    setIsPlaying(true);
  }

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
        <Button variant="ghost" size="icon" onClick={() => playSongHandler()}>
          <ChevronFirstIcon className="text-black dark:text-muted-foreground stroke-3 scale-115" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => playSongHandler()}>
          {isPlaying ? (
            <Pause className="text-black dark:text-muted-foreground fill-muted-foreground scale-115" />
          ) : (
            <Play className="text-black dark:text-muted-foreground fill-muted-foreground scale-115" />
          )}
        </Button>
        <Button variant="ghost" size="icon" onClick={() => playSongHandler()}>
          <ChevronLast className="text-black dark:text-muted-foreground stroke-3 scale-115" />
        </Button>
      </div>

      <audio
        src={trackURL}
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentDuration(e.currentTarget.currentTime)}
      />
    </div>
  );
}
