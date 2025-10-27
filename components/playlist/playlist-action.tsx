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
import { DeleteDialog, DeleteDialogTrigger } from "../ui/delete-dialog";

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
      <Dialog>
        <DeleteDialog
          content="playlist"
          disabled={loading}
          action={() => execute({ playlistID: playlist.id })}
        >
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
                <DeleteDialogTrigger>
                  <DropdownMenuItem
                    className="transition-colors duration-200 text-xs cursor-pointer focus:bg-destructive/25 dark:focus:bg-destructive/25"
                    onClick={(e) => e.stopPropagation()}
                    disabled={loading}
                  >
                    Delete Playlist <Trash2Icon />
                  </DropdownMenuItem>
                </DeleteDialogTrigger>
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
        </DeleteDialog>
      </Dialog>
    </DropdownMenu>
  );
}
