"use client";

import { Session } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { EditIcon, LinkIcon, MoreVertical, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useAction } from "next-safe-action/hooks";
import { deletePlaylist } from "@/server/actions/delete-playlist";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import EditPlaylistForm from "./edit-playlist-form";
import { DisplayPlaylistType } from "@/types/common-types";

export default function PlaylistActions({
  session,
  playlist,
}: {
  session: Session | null | undefined;
  playlist: DisplayPlaylistType;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function copyToClipboard() {
    navigator.clipboard.writeText(
      `https://waves-reimagined.vercel.app/playlist?list=${playlist.id}`
    );
    toast.success("Copied URL");
  }

  const { execute } = useAction(deletePlaylist, {
    onSuccess: (data) => {
      toast.dismiss();
      setLoading(false);
      if (data.data?.error) {
        toast.error(data.data.error);
      }
      if (data.data?.success) {
        toast.success(data.data.success);
        router.refresh();
      }
    },
    onExecute: () => {
      toast.loading("Deleting Playlist...");
      setLoading(true);
    },
  });

  if (!playlist.editable) return;

  return (
    <DropdownMenu>
      <AlertDialog>
        <Dialog>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="w-7 h-7">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="left">
            <DropdownMenuItem
              className="transition-colors duration-200 text-xs cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard();
              }}
            >
              Copy URL <LinkIcon />
            </DropdownMenuItem>
            {(session?.user.handle === playlist.userHandle ||
              session?.user.role === "admin") && (
              <>
                <DialogTrigger asChild>
                  <DropdownMenuItem className="transition-colors duration-200 text-xs cursor-pointer">
                    Edit Playlist <EditIcon />
                  </DropdownMenuItem>
                </DialogTrigger>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="transition-colors duration-200 text-xs cursor-pointer focus:bg-destructive/25 dark:focus:bg-destructive/25"
                    onClick={(e) => e.stopPropagation()}
                    disabled={loading}
                  >
                    Delete Playlist <Trash2Icon />
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </>
            )}
          </DropdownMenuContent>
          <DialogContent className="px-4 md:px-6">
            <DialogHeader className="mb-4">
              <DialogTitle>Edit your playlist</DialogTitle>
            </DialogHeader>
            <EditPlaylistForm
              name={playlist.name}
              description={playlist.description}
              playlistID={playlist.id}
              visibility={playlist.visibility}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button>Done</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permenantly delete your
              playlist from Waves Music.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer bg-destructive hover:bg-destructive/80"
              disabled={loading}
              onClick={() => execute({ playlistID: playlist.id })}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  );
}
