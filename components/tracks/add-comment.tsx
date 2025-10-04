"use client";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { VscLoading } from "react-icons/vsc";
import { SendHorizonal } from "lucide-react";
import {
  LoginAlertDialog,
  LoginAlertDialogTrigger,
} from "./login-alert-dialog";
import { Session } from "next-auth";
import { useAction } from "next-safe-action/hooks";
import { postComment } from "@/server/actions/post-comment";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentSchema } from "@/types/comment-schema";
import z from "zod";

export default function AddComment({
  session,
  trackID,
}: {
  session: Session | null | undefined;
  trackID: string;
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      comment: "",
      trackID: trackID,
      userID: session?.user.id ?? "",
    },
  });

  const { execute } = useAction(postComment, {
    onSuccess: (data) => {
      toast.dismiss();
      setLoading(false);
      if (data.data.error) {
        toast.error(data.data.error);
      }
      if (data.data.success) {
        toast.success(data.data.success);
        form.reset();
      }
    },
    onExecute: () => {
      setLoading(true);
    },
  });

  function onSubmit(values: z.infer<typeof CommentSchema>) {
    if (!session) return;
    execute(values);
  }

  useEffect(() => {
    form.setValue("trackID", trackID);
    form.setValue("comment", "");
  }, [trackID, form]);

  return (
    <LoginAlertDialog session={session}>
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
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoginAlertDialogTrigger>
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
            </LoginAlertDialogTrigger>
          </div>
        </form>
      </Form>
    </LoginAlertDialog>
  );
}
