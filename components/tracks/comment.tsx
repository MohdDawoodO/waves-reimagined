"use client";

import UserImage from "../navigation/user-image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { EditIcon, MoreVertical, Trash2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Session } from "next-auth";
import { formatDistance } from "date-fns";
import { useAction } from "next-safe-action/hooks";
import { deleteComment } from "@/server/actions/delete-comment";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  EditCommentDialog,
  EditCommentDialogTrigger,
} from "./edit-comment-dialog";
import { DeleteDialog, DeleteDialogTrigger } from "../ui/delete-dialog";

export default function Comment({
  comment,
  commentID,
  userAvatar,
  userHandle,
  userName,
  trackOwnerHandle,
  className,
  commentedOn,
  session,
  commentUserID,
  trackID,
}: {
  comment?: string | undefined | null;
  commentID?: number | undefined | null;
  userAvatar?: string | undefined | null;
  userName?: string | undefined | null;
  userHandle?: string | undefined | null;
  trackOwnerHandle?: string | undefined | null;
  commentedOn?: Date | null | undefined;
  className?: string;
  session?: Session | null | undefined;
  commentUserID?: string | null | undefined;
  trackID?: string | null | undefined;
}) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const { execute } = useAction(deleteComment, {
    onSuccess: (data) => {
      toast.dismiss();
      setDeleting(false);
      if (data.data?.error) {
        toast.error(data.data.error);
      }
      if (data.data?.success) {
        toast.success(data.data.success);
        router.refresh();
      }
    },
    onExecute: () => {
      setDeleting(true);
      toast.loading("Deleting comment...");
    },
  });

  if (!comment || !userName || !commentedOn)
    return (
      <div className={cn("flex gap-4 w-full ", className)}>
        <p className="text-sm text-muted-foreground">
          Be the first one to comment
        </p>
      </div>
    );

  const words = comment.split(" ");

  return (
    <EditCommentDialog
      comment={comment}
      trackID={trackID!}
      commentID={commentID!}
    >
      <DeleteDialog
        content="comment"
        disabled={deleting}
        action={() => execute({ trackID: trackID!, commentID: commentID! })}
      >
        <div className={cn("flex items-start gap-4 w-full", className)}>
          <div>
            <UserImage name={userName} image={userAvatar} className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div>
                {!userHandle && <h3>{userName}</h3>}
                {userHandle && (
                  <Link
                    href={`/profile/${userHandle}/home`}
                    className="hover:underline"
                    target="_blank"
                  >
                    @{userHandle}
                  </Link>
                )}
              </div>
              <p>
                {formatDistance(commentedOn, new Date()).replace("about", "") +
                  " ago"}
              </p>
            </div>
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-foreground flex gap-1 flex-wrap">
                {words.map((word, i) => (
                  <span
                    key={word + i}
                    className={cn(word.length > 15 ? "break-all" : null)}
                  >
                    {word}
                  </span>
                ))}
              </p>
              {(session?.user.role === "admin" ||
                session?.user.id === commentUserID ||
                session?.user.handle === trackOwnerHandle) && (
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="p-1 aspect-square h-fit w-fit"
                      >
                        <MoreVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      {session?.user.id === commentUserID && (
                        <EditCommentDialogTrigger>
                          <DropdownMenuItem
                            className="transition-all duration-200 text-xs cursor-pointer"
                            disabled={deleting}
                          >
                            Edit <EditIcon className="scale-90" />
                          </DropdownMenuItem>
                        </EditCommentDialogTrigger>
                      )}
                      <DeleteDialogTrigger className="w-full">
                        <DropdownMenuItem
                          className="transition-all duration-200 focus:bg-destructive/25 dark:focus:bg-destructive/20 text-xs cursor-pointer"
                          disabled={deleting}
                        >
                          Delete <Trash2Icon className="scale-90" />
                        </DropdownMenuItem>
                      </DeleteDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        </div>
      </DeleteDialog>
    </EditCommentDialog>
  );
}
