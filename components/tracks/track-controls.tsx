"use client";

import { useEffect, useRef, useState } from "react";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import {
  Bookmark,
  ChevronFirstIcon,
  ChevronLast,
  Heart,
  Link,
  MoreVertical,
  Pause,
  Play,
  Trash2,
  Volume1Icon,
  Volume2Icon,
  VolumeIcon,
  VolumeOffIcon,
} from "lucide-react";
import { TbPlaylistAdd } from "react-icons/tb";
import { timeFormat } from "@/lib/time-format";
import { usePathname, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { suggestedTrackIDs } from "@/lib/states";
import { PlaylistWithTrackType, TrackType } from "@/types/common-types";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import { Separator } from "@/components/ui/separator";
import { Session } from "next-auth";
import { useAction } from "next-safe-action/hooks";
import { formatNumber } from "@/lib/format-number";
import { likeTrackHandler } from "@/server/actions/like-track-handler";
import { bookmarkTrackHandler } from "@/server/actions/bookmark-track-handler";
import {
  PlaylistsDialog,
  PlaylistsDialogTrigger,
} from "../playlist/playlists-dialog";
import {
  LoginAlertDialog,
  LoginAlertDialogTrigger,
} from "./login-alert-dialog";
import {
  DeleteTrackDialog,
  DeleteTrackDialogTrigger,
} from "./delete-track-dialog";
import { TooltipMessage } from "../ui/tooltip-message";

export default function TrackControls({
  tracks,
  isBookmarked,
  isLiked,
  session,
  userPlaylists,
}: {
  tracks: TrackType[];
  isBookmarked: boolean;
  isLiked: boolean;
  session?: Session | null | undefined;
  userPlaylists: PlaylistWithTrackType[];
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [currentVolume, setCurrentVolume] = useState(1);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(tracks[0].likes);
  const pathname = usePathname();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [trackIDs, setTrackIDs] = useAtom(suggestedTrackIDs);
  const trackURL = tracks[0].trackURL;

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

  function muteAudio() {
    if (!audioRef.current) return;

    if (volume === 0) {
      audioRef.current.volume = currentVolume;
      return;
    }
    setCurrentVolume(volume);
    audioRef.current.volume = 0;
  }

  function copySongURL() {
    navigator.clipboard.writeText(
      `https://waves-reimagined.vercel.app/listen?t=${tracks[0].id}`
    );

    toast.success("Copied URL!");
  }

  async function likeSong() {
    if (!session) {
      return;
    }

    if (!liked) {
      setLiked(true);
      setLikes((prev) => prev + 1);
    } else {
      setLiked(false);
      setLikes((prev) => prev - 1);
    }

    await likeTrackHandler(session.user.id, tracks[0].id);
  }

  async function bookmarkSong() {
    if (!session) {
      return;
    }

    if (!bookmarked) {
      setBookmarked(true);
    } else {
      setBookmarked(false);
    }

    executeBookmark({ userID: session.user.id, trackID: tracks[0].id });
  }

  const { execute: executeBookmark } = useAction(bookmarkTrackHandler, {
    onSuccess: (data) => {
      if (data.data?.error) {
        toast.error(data.data.error);
      }
      if (data.data?.success) {
        toast.success(data.data.success);
      }
    },
  });

  //* Runs only once to set autoPlay tracks
  useEffect(() => {
    setTrackIDs(tracks.map((track) => track.id));
    // eslint-disable-next-line
  }, [setTrackIDs]);

  useEffect(() => {
    const promise = audioRef.current?.play();
    promise?.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    const currentIndex = trackIDs.findIndex((id) => id === tracks[0].id);
    setIndex(currentIndex);
    setLiked(isLiked);
    setLikes(tracks[0].likes);
    setBookmarked(isBookmarked);
  }, [trackURL, pathname, setIndex, trackIDs, tracks, isBookmarked, isLiked]);

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-4">
      <div className="w-full flex gap-4 text-xs text-black dark:text-muted-foreground">
        <p>{timeFormat(currentDuration)}</p>
        <Slider
          value={[currentDuration]}
          step={0.01}
          max={tracks[0].duration}
          onValueChange={(value) => {
            if (audioRef.current) audioRef.current.currentTime = value[0];
          }}
        />
        <p>{timeFormat(tracks[0].duration)}</p>
      </div>
      <div className="flex flex-col gap-8 items-center w-full">
        <div className="flex gap-4">
          <Button variant="ghost" size="icon" onClick={() => previousSong()}>
            <ChevronFirstIcon className="stroke-3 scale-115 text-black dark:text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => playSongHandler()}>
            {isPlaying ? (
              <Pause className="text-black fill-black dark:text-muted-foreground dark:fill-muted-foreground scale-115" />
            ) : (
              <Play className="text-black fill-black dark:text-muted-foreground dark:fill-muted-foreground scale-115" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => nextSong()}>
            <ChevronLast className="stroke-3 scale-115 text-black dark:text-muted-foreground" />
          </Button>
        </div>

        <div className="w-full flex flex-col gap-4">
          <Separator />
          <div className="flex w-full justify-between gap-4">
            <div className="flex items-center group">
              <TooltipMessage
                message={audioRef.current?.volume !== 0 ? "Mute" : "Unmute"}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-black dark:text-muted-foreground"
                  onClick={() => muteAudio()}
                >
                  {volume === 0 && <VolumeOffIcon className="scale-115" />}
                  {volume < 0.25 && volume > 0 && (
                    <VolumeIcon className="scale-115" />
                  )}
                  {volume < 0.5 && volume > 0.25 && (
                    <Volume1Icon className="scale-115" />
                  )}
                  {volume > 0.5 && <Volume2Icon className="scale-115" />}
                </Button>
              </TooltipMessage>
              <div className="hidden md:flex overflow-hidden py-3 translate-x-2 group-hover:px-2 duration-200">
                <Slider
                  className="w-0 group-hover:w-20 transition-all duration-200"
                  value={[volume]}
                  onValueChange={(value) => {
                    if (audioRef.current) {
                      audioRef.current.volume = value[0];
                    }
                  }}
                  step={0.01}
                  max={1}
                />
              </div>
            </div>

            <LoginAlertDialog session={session}>
              <PlaylistsDialog
                session={session}
                userPlaylists={userPlaylists}
                trackID={tracks[0].id}
              >
                <LoginAlertDialogTrigger>
                  <TooltipMessage
                    message={
                      !bookmarked
                        ? "Add to watch later"
                        : "Remove from watch later"
                    }
                  >
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => bookmarkSong()}
                      className="group"
                    >
                      <Bookmark
                        className={cn(
                          "scale-115 transition-all duration-200 ease-out fill-background",
                          bookmarked
                            ? "text-foreground fill-foreground"
                            : "dark:text-muted-foreground group-hover:fill-muted"
                        )}
                      />
                    </Button>
                  </TooltipMessage>
                </LoginAlertDialogTrigger>

                <div className="text-sm flex items-center gap-2 text-black dark:text-muted-foreground">
                  <LoginAlertDialogTrigger>
                    <TooltipMessage message={!liked ? "Like" : "Dislike"}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="group"
                        onClick={() => likeSong()}
                      >
                        <Heart
                          className={cn(
                            "scale-115 transition-all duration-200 ease-out fill-background",
                            liked
                              ? "text-primary fill-primary"
                              : "dark:text-muted-foreground group-hover:fill-muted"
                          )}
                        />
                      </Button>
                    </TooltipMessage>
                  </LoginAlertDialogTrigger>

                  <div className="flex relative">
                    <AnimatePresence mode="popLayout">
                      {[...formatNumber(likes)].map((letter, i) => (
                        <div key={i + letter} className="overflow-hidden">
                          <motion.span
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "-100%" }}
                            transition={{ delay: i * 0.1 }}
                            className="inline-flex"
                          >
                            {letter}
                          </motion.span>
                        </div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <LoginAlertDialogTrigger>
                  <PlaylistsDialogTrigger>
                    <TooltipMessage message="Add to playlist">
                      <Button size="icon" variant="ghost">
                        <TbPlaylistAdd
                          className={cn(
                            "text-black dark:text-muted-foreground scale-150"
                          )}
                        />
                      </Button>
                    </TooltipMessage>
                  </PlaylistsDialogTrigger>
                </LoginAlertDialogTrigger>
              </PlaylistsDialog>
            </LoginAlertDialog>

            <DeleteTrackDialog
              session={session}
              currentTrack={tracks[0]}
              isPlaying={isPlaying}
              playSongHandler={playSongHandler}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-black dark:text-muted-foreground"
                  >
                    <MoreVertical className="scale-115" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="left">
                  <DropdownMenuItem
                    className="cursor-pointer text-foreground text-xs transition-colors duration-200"
                    onClick={() => copySongURL()}
                  >
                    Copy URL <Link />
                  </DropdownMenuItem>
                  {(session?.user.id === tracks[0].userID ||
                    session?.user.role === "admin") && (
                    <>
                      <DeleteTrackDialogTrigger className="w-full">
                        <DropdownMenuItem className="cursor-pointer text-foreground text-xs focus:bg-destructive/25 dark:focus:bg-destructive/20 transition-colors duration-200">
                          Delete Track <Trash2 />
                        </DropdownMenuItem>
                      </DeleteTrackDialogTrigger>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </DeleteTrackDialog>
          </div>
        </div>
      </div>

      <audio
        src={trackURL}
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentDuration(e.currentTarget.currentTime)}
        onVolumeChange={(e) => setVolume(e.currentTarget.volume)}
        onEnded={() => nextSong()}
      />
    </div>
  );
}
