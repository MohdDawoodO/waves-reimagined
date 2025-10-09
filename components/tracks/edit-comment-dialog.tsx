"use client";

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { VscLoading } from "react-icons/vsc";
import { SendHorizonal } from "lucide-react";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useAction } from "next-safe-action/hooks";
import { updateComment } from "@/server/actions/update-comment";
import { toast } from "sonner";
import { EditCommentSchema } from "@/types/edit-comment-schema";

export function EditCommentDialog({
  comment,
  commentID,
  trackID,
  children,
}: {
  comment: string;
  commentID: number;
  trackID: string;
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(EditCommentSchema),
    defaultValues: { comment, trackID, commentID },
  });

  const { execute } = useAction(updateComment, {
    onExecute: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      setLoading(false);
      setOpen(false);
      if (data.data?.error) {
        toast.error(data.data.error);
      }
      if (data.data?.success) {
        toast.success(data.data.success);
      }
    },
  });

  function onSubmit(values: z.infer<typeof EditCommentSchema>) {
    execute(values);
  }

  useEffect(() => {
    if (open) {
      form.setValue("comment", comment);
      form.setValue("commentID", commentID);
      form.setValue("trackID", trackID);
    }
  }, [open, comment, commentID, trackID, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Comment</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-2 text-white">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Add a comment"
                        type="text"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={loading}
                size="icon"
                className="group"
                type="submit"
              >
                {loading ? (
                  <VscLoading className="animate-spin w-4 h-4" />
                ) : (
                  <SendHorizonal className="group-hover:scale-95 group-hover:translate-x-[2px] transition-all duration-200" />
                )}
              </Button>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild disabled={loading}>
            <Button>Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditCommentDialogTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DialogTrigger asChild>{children}</DialogTrigger>;
}
