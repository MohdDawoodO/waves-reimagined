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
import { PlaylistType } from "@/types/common-types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Playlist from "./playlist";

export function PlaylistsDialog({
  userPlaylists,
  session,
  children,
}: {
  userPlaylists: PlaylistType[];
  session: Session | null | undefined;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [createPlaylist, setCreatePlaylist] = useState(false);

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
            <DialogTitle>Select your playlist</DialogTitle>
          </DialogHeader>
          {createPlaylist ? (
            <CreatePlaylistForm
              setCreatePlaylist={setCreatePlaylist}
              userID={session.user.id}
            />
          ) : (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                {userPlaylists.map((playlist) => (
                  <Playlist
                    id={playlist.id}
                    name={playlist.name}
                    visibility={playlist.visibility}
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
