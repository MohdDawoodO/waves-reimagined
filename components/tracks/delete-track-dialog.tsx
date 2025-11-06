"use client";

import { useAction } from "next-safe-action/hooks";
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
import { deleteTrack } from "@/server/actions/delete-track";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { TrackType } from "@/types/common-types";

export function DeleteTrackDialog({
  isPlaying,
  playSongHandler,
  currentTrack,
  session,
  children,
}: {
  isPlaying?: boolean;
  playSongHandler?: () => void;
  currentTrack: TrackType;
  session: Session | null | undefined;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { execute, status } = useAction(deleteTrack, {
    onSuccess: (data) => {
      toast.dismiss();

      if (data.data?.error) {
        toast.error(data.data.error);
      }
      if (data.data?.success) {
        toast.success(data.data.success);
        if (session?.user.id === currentTrack.userID) {
          router.push(`/profile/${session?.user.handle}/home`);
          return;
        }
        if (session?.user.role === "admin") {
          router.push(`/`);
        }
      }
    },
    onExecute: () => {
      toast.loading("Deleting Track...");
    },
  });

  return (
    <AlertDialog>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permenantly delete your
            track from Waves Music.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer bg-destructive hover:bg-destructive/80"
            onClick={() => {
              if (status === "executing") return;

              if (isPlaying && playSongHandler) {
                playSongHandler();
              }
              execute({ trackID: currentTrack.id });
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DeleteTrackDialogTrigger({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <AlertDialogTrigger className={className}>{children}</AlertDialogTrigger>
  );
}
