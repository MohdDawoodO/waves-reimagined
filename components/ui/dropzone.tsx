"use client";

import { AudioLines, Pause, Play, Upload, XIcon } from "lucide-react";
import { Card, CardContent } from "./card";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Slider } from "./slider";

export function Dropzone({
  value,
  fileName,
  fileType,
  maxFileSize,
  setFileName,
  setFileDuration,
  onChange: setValue,
  onError: setError,
  className,
}: {
  value?: string | undefined;
  fileName?: string | undefined;
  fileType: "image" | "audio";
  maxFileSize: number;
  setFileName?: Dispatch<SetStateAction<string>> | undefined;
  setFileDuration?: Dispatch<SetStateAction<number>> | undefined;
  onChange?: Dispatch<SetStateAction<string | undefined>> | undefined;
  onError?: Dispatch<SetStateAction<string>> | undefined;
  className?: string;
}) {
  const [currentFileURL, setCurrentFileURL] = useState(value ?? "");
  const [currentFileName, setCurrentFileName] = useState(fileName ?? "");

  const setFileStatus = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    for (const file of e.target.files) {
      const fileSize = file.size / (1024 * 1024);

      if (fileType === "image" && !file.type.includes("image")) {
        if (setError) setError("Please upload an image");
        return;
      }

      if (fileType === "audio" && !file.type.includes("audio")) {
        if (setError) setError(`Please upload an audio`);
        return;
      }

      if (fileSize > maxFileSize) {
        if (setError) setError(`Max file size is ${maxFileSize} MB`);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener("load", () => {
        if (setValue) {
          setValue(reader.result as string);
        }
        setCurrentFileURL(reader.result as string);
      });

      setCurrentFileName(file.name);
      if (setFileName) {
        setFileName(file.name);
      }

      if (setError) setError("");
    }

    e.target.value = null!;
  };

  return (
    <Card className={cn(className)}>
      <CardContent>
        <div
          className={cn(
            "rounded-md p-4 flex flex-col gap-2 items-center justify-center text-muted-foreground relative",
            currentFileURL
              ? "aspect-square"
              : "aspect-video border-2 border-dashed",
            fileType === "audio" && currentFileURL
              ? "border-2 border-dashed aspect-8/7"
              : null
          )}
        >
          {!currentFileURL && (
            <>
              <input
                type="file"
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                onChange={setFileStatus}
              />
              <Upload className="w-12 h-12 md:h-16 md:w-16" />
              <p className="text-xs md:text-sm">
                Max File Size: {maxFileSize} MB
              </p>
            </>
          )}
          {currentFileURL && (
            <>
              <FileDisplay
                setFileDuration={setFileDuration}
                currentFileURL={currentFileURL}
                currentFileName={currentFileName}
                fileType={fileType}
              />
              <Button
                size={"icon"}
                onClick={() => {
                  setCurrentFileURL("");
                  if (setValue) setValue(undefined);
                }}
                variant={"secondary"}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full cursor-pointer bg-zinc-600 dark:bg-zinc-700 hover:bg-zinc-500 text-white"
              >
                <XIcon size={12} className="scale-90" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function FileDisplay({
  setFileDuration,
  currentFileURL,
  currentFileName,
  fileType,
}: {
  setFileDuration?: Dispatch<SetStateAction<number>> | undefined;
  currentFileURL: string;
  currentFileName?: string;
  fileType: "image" | "audio";
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  if (fileType === "image") {
    return (
      <Image
        src={currentFileURL}
        alt="image"
        width={400}
        height={400}
        className="absolute top-0 left-0 rounded-md w-full aspect-square object-cover"
      />
    );
  }

  if (fileType === "audio") {
    const playSongHandler = () => {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
        return;
      }

      audioRef.current?.play();
      setIsPlaying(true);
    };

    const timeFormat = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time) % (minutes * 60 || 60);

      const formattedTime = `${minutes < 10 ? 0 : ""}${minutes}:${
        seconds < 10 ? 0 : ""
      }${seconds}`;

      return formattedTime;
    };

    return (
      <div className="absolute top-0 left-0 rounded-md w-full aspect-8/7 object-cover flex items-center justify-center flex-col">
        <AudioLines className="w-16 h-16 md:w-18 md:h-18 mb-2 md:mb-6" />
        <div className="w-52 md:w-64 flex flex-col gap-2">
          <p className="text-center line-clamp-2 text-sm">{currentFileName}</p>
          <div className="flex items-center gap-4 w-full">
            <p className="text-xs">{timeFormat(currentTime)}</p>
            <Slider
              className="accent-primary w-full"
              min={0}
              step={0.1}
              max={duration}
              value={[currentTime]}
              onValueChange={(value) => {
                if (audioRef.current) audioRef.current.currentTime = value[0];
                setCurrentTime(value[0]);
              }}
            />
            <p className="text-xs">{timeFormat(duration)}</p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={"secondary"}
              className="p-1 w-8 h-8"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                playSongHandler();
              }}
            >
              {isPlaying ? (
                <Pause className="text-muted-foreground fill-muted-foreground" />
              ) : (
                <Play className="text-muted-foreground fill-muted-foreground" />
              )}
            </Button>
          </div>
        </div>

        <audio
          src={currentFileURL}
          ref={audioRef}
          onCanPlay={(e) => {
            setDuration(e.currentTarget.duration);
            if (setFileDuration) {
              setFileDuration(e.currentTarget.duration);
            }
          }}
          onTimeUpdate={(e) => {
            setCurrentTime(e.currentTarget.currentTime);
          }}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }}
        />
      </div>
    );
  }
}
