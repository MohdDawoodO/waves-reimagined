"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import z from "zod";
import { Button } from "../ui/button";
import FormError from "../auth/form-error";
import FormSuccess from "../auth/form-success";
import { Input } from "../ui/input";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter } from "next/navigation";
import { VscLoading } from "react-icons/vsc";
import { EditPlaylistSchema } from "@/types/edit-playlist-schema";
import { useAction } from "next-safe-action/hooks";
import { editPlaylist } from "@/server/actions/edit-playlist";

export default function EditPlaylistForm({
  playlistID,
  name,
  description,
  visibility,
}: {
  playlistID: string;
  name: string;
  description: string;
  visibility: "public" | "unlisted" | "private";
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(EditPlaylistSchema),
    defaultValues: {
      name,
      description,
      visibility,
      playlistID,
    },
    mode: "onChange",
  });

  const { execute, status } = useAction(editPlaylist, {
    onSuccess: (data) => {
      if (data.data?.error) {
        setSuccess("");
        setError(data.data.error);
      }
      if (data.data?.success) {
        setError("");
        setSuccess(data.data.success);

        setTimeout(() => {
          router.refresh();
        }, 500);
      }
    },
  });

  function onSubmit(values: z.infer<typeof EditPlaylistSchema>) {
    execute(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Playlist Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your playlist name"
                    autoComplete="name"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Playlist Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Add a short description for your playlist (max 200 characters)"
                    autoComplete="name"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visibility</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Public" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="unlisted">Unlisted</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <FormError error={error} />}
          {success && <FormSuccess success={success} />}

          <Button disabled={status === "executing"} type="submit">
            {status === "executing" ? (
              <VscLoading className="animate-spin w-4 h-4" />
            ) : (
              "Update Playlist"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
