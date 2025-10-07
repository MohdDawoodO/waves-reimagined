"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dropzone } from "@/components/ui/dropzone";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import Tags from "../upload/input-tags";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormError from "@/components/auth/form-error";
import FormSuccess from "@/components/auth/form-success";
import { Button } from "@/components/ui/button";
import { TrackType } from "@/types/common-types";
import { UpdateTrackSchema } from "@/types/update-track-schema";
import { useAction } from "next-safe-action/hooks";
import { updateTrack } from "@/server/actions/update-track";
import { toast } from "sonner";
import { cloudinarySignature } from "@/lib/cloudinary-signature";

export default function EditForm({ soundTrack }: { soundTrack: TrackType }) {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(UpdateTrackSchema),
    defaultValues: {
      trackID: soundTrack.id,
      description: soundTrack.description,
      albumCover: {
        imageURL: soundTrack.albumCover?.imageURL,
        publicID: undefined,
      },
      name: soundTrack.trackName,
      tags: soundTrack.trackTags?.map((tag) => tag.tag),
      visibility: soundTrack.visibility!,
    },
    mode: "onChange",
  });

  const { execute } = useAction(updateTrack, {
    onExecute: () => {
      setLoading(true);
      toast.loading("Updating Track...");
    },
    onSuccess: (data) => {
      toast.dismiss();
      setLoading(false);
      if (data.data?.error) {
        setError(data.data.error);
        setSuccess("");
      }
      if (data.data?.success) {
        setSuccess(data.data.success);
        setError("");
      }
    },
  });

  async function onSubmit(values: z.infer<typeof UpdateTrackSchema>) {
    if (values.albumCover.imageURL !== soundTrack.albumCover?.imageURL) {
      setLoading(true);

      const { apiURL, formData } = await cloudinarySignature("image");
      formData.append("file", values.albumCover.imageURL);

      const uploadedImage = await fetch(apiURL, {
        method: "POST",
        body: formData,
      }).then((response) => response.json());

      execute({
        ...values,
        albumCover: {
          imageURL: uploadedImage.url,
          publicID: uploadedImage.public_id,
        },
      });
      return;
    }
    execute(values);
  }

  return (
    <Card className={"mx-auto max-w-xl py-4 md:py-6 mb-8"}>
      <CardHeader className="px-4 md:px-6">
        <CardTitle>Upload a new track</CardTitle>
        <CardDescription>Share your track with the world</CardDescription>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="albumCover.imageURL"
                render={() => (
                  <FormItem>
                    <FormLabel>Upload your album cover</FormLabel>
                    <FormControl>
                      <Dropzone
                        value={form.getValues("albumCover.imageURL")}
                        fileType="image"
                        maxFileSize={1}
                        onChange={(value) => {
                          form.setValue("albumCover.imageURL", value as string);
                          form.clearErrors();
                        }}
                        onError={setError}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Track Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your track name" />
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
                    <FormLabel>Track Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-fit max-h-fit"
                        placeholder="Add a short description for your track (max 200 characters)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Track Tags</FormLabel>
                    <FormControl>
                      <Tags
                        value={form.getValues("tags")}
                        onChange={field.onChange}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <FormError error={error} />}
              {success && <FormSuccess success={success} />}

              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Track"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
