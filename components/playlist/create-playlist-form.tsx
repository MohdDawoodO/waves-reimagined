"use client";

import { PlaylistSchema } from "@/types/playlist-schema";
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
import { Dispatch, SetStateAction, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAction } from "next-safe-action/hooks";
import { createPlaylist } from "@/server/actions/create-playlist";
import { useRouter } from "next/navigation";
import { VscLoading } from "react-icons/vsc";

export default function CreatePlaylistForm({
  setCreatePlaylist,
  userID,
}: {
  setCreatePlaylist: Dispatch<SetStateAction<boolean>>;
  userID: string;
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(PlaylistSchema),
    defaultValues: {
      name: "",
      description: "",
      visibility: "public" as "public" | "unlisted" | "public",
      userID,
    },
    mode: "onChange",
  });

  const { execute, status } = useAction(createPlaylist, {
    onSuccess: (data) => {
      if (data.data?.error) {
        setSuccess("");
        setError(data.data.error);
        setTimeout(() => {
          router.refresh();
          setCreatePlaylist(false);
        }, 500);
      }
      if (data.data?.success) {
        setError("");
        setSuccess(data.data.success);
      }
    },
  });

  function onSubmit(values: z.infer<typeof PlaylistSchema>) {
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
              "Create Playlist"
            )}
          </Button>

          <Button
            variant={"link"}
            className="p-0 w-fit mx-auto"
            type="button"
            onClick={() => setCreatePlaylist(false)}
            disabled={status === "executing"}
          >
            <ArrowLeft /> Go back
          </Button>
        </div>
      </form>
    </Form>
  );
}
