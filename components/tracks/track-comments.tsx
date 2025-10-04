"use client";

import { CommentType } from "@/types/common-types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import AddComment from "./add-comment";
import { Session } from "next-auth";
import Comment from "./comment";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format-number";

export default function TrackComments({
  comments,
  session,
  trackOwnerHandle,
}: {
  comments: CommentType[];
  session: Session | null | undefined;
  trackOwnerHandle: string;
}) {
  const latestComment = comments[0];

  return (
    <div className="w-full max-w-md flex flex-col gap-8">
      <div className="2xl:hidden">
        <Drawer>
          <DrawerTrigger className="w-full" asChild>
            <Card>
              <CardHeader className="gap-4 text-start">
                <CardTitle>Comments: {formatNumber(comments.length)}</CardTitle>
                <AddComment session={session} />
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground gap-8">
                {latestComment && (
                  <Comment
                    comment={latestComment.comment}
                    userAvatar={latestComment.commentUser.image}
                    userHandle={latestComment.commentUser.handle}
                    userName={latestComment.commentUser.name}
                  />
                )}
                {!latestComment && <Comment />}
              </CardContent>
            </Card>
          </DrawerTrigger>
          <DrawerContent className="px-6 pr-2 py-2 min-h-20">
            <div className="overflow-y-auto mx-auto my-8 pr-4 w-full h-[80rem] max-w-md custom-scrollbar">
              <DrawerTitle />
              <Comments
                comments={comments}
                session={session}
                trackOwnerhandle={trackOwnerHandle}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="hidden 2xl:flex">
        <Comments
          comments={comments}
          session={session}
          trackOwnerhandle={trackOwnerHandle}
        />
      </div>
    </div>
  );
}

function Comments({
  comments,
  session,
  trackOwnerhandle,
}: {
  session: Session | null | undefined;
  comments: CommentType[];
  trackOwnerhandle: string;
}) {
  return (
    <div
      className={cn(
        "max-w-md flex flex-col w-full",
        comments[0] ? "gap-12" : "gap-6"
      )}
    >
      <div className="flex flex-col gap-4">
        <h2 className="pt-4">Comments: {formatNumber(comments.length)}</h2>
        <AddComment session={session} />
      </div>
      <div className="flex flex-col gap-8 2xl:gap-10">
        {!comments[0] && <Comment />}
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment.comment}
            userAvatar={comment.commentUser.image}
            userHandle={comment.commentUser.handle}
            userName={comment.commentUser.name}
            className="border-b-2 pb-4"
            session={session}
            commentedOn={comment.commentedOn}
            trackOwnerHandle={trackOwnerhandle}
            commentID={comment.id}
          />
        ))}
      </div>
    </div>
  );
}
