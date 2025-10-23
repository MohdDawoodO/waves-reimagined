"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import CreatePlaylistForm from "./create-playlist-form";
import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Session } from "next-auth";
import { PlaylistWithTrackType } from "@/types/common-types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Playlist from "./playlist";

export function PlaylistsDialog({
  userPlaylists,
  trackID,
  session,
  children,
}: {
  userPlaylists: PlaylistWithTrackType[];
  trackID: string;
  session: Session | null | undefined;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [createPlaylist, setCreatePlaylist] = useState(false);
  const [executing, setExecuting] = useState(false);

  return (
    <Dialog
      onOpenChange={(event) => {
        if (event === true) {
          setCreatePlaylist(false);
        }
      }}
    >
      {children}
      {session && (
        <DialogContent className="px-4 md:px-6">
          <DialogHeader className="mb-4">
            <DialogTitle>
              {createPlaylist ? "Create" : "Select"} your playlist
            </DialogTitle>
          </DialogHeader>
          {createPlaylist ? (
            <CreatePlaylistForm
              setCreatePlaylist={setCreatePlaylist}
              trackID={trackID}
              userID={session.user.id}
            />
          ) : (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                {userPlaylists.map((playlist) => (
                  <Playlist
                    id={playlist.id}
                    name={playlist.name}
                    visibility={playlist.visibility}
                    track={playlist.playlistTracks[0]}
                    trackID={trackID}
                    executing={executing}
                    setExecuting={setExecuting}
                    key={playlist.id}
                  />
                ))}
              </div>

              <button
                className="w-full sm:w-fit flex items-center justify-center gap-2 text-sm text-primary hover:underline underline-offset-2 cursor-pointer"
                onClick={() => {
                  if (!session.user.handle) {
                    router.push("/settings/account");
                    toast.message("Set a handle to create playlist");
                    return;
                  }

                  setCreatePlaylist(true);
                }}
              >
                create new playlist <PlusCircle size={16} />
              </button>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button>Done</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}

export function PlaylistsDialogTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DialogTrigger asChild>{children}</DialogTrigger>;
}
