"use client";

import FormError from "@/components/auth/form-error";
import FormSuccess from "@/components/auth/form-success";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { TrackSchema } from "@/types/track-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import { Session } from "next-auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import Tags from "./input-tags";
import { useAction } from "next-safe-action/hooks";
import { uploadTrack } from "@/server/actions/upload-track";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UploadForm({ session }: { session: Session }) {
  const router = useRouter();

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const [uploadProgress, setUploadProgress] = useState<
    "upload-track" | "upload-cover" | "enter-details"
  >("upload-track");

  const form = useForm({
    resolver: zodResolver(TrackSchema),
    defaultValues: {
      userID: session.user.id,
      name: "",
      description: "",
      albumCover: undefined,
      soundTrack: undefined,
      tags: undefined,
      visibility: "public",
    },
    mode: "onChange",
  });

  const { execute, status } = useAction(uploadTrack, {
    onSuccess: (data) => {
      toast.dismiss();
      if (data.data?.error) {
        setError(data.data.error);
        setSuccess("");
      }
      if (data.data?.success) {
        setSuccess(data.data.success);
        setError("");

        setTimeout(() => {
          router.push(`/profile/${session.user.handle}/tracks`);
        }, 500);
      }
    },
    onError: (error) => {
      console.log("client error:", error);
    },
    onExecute: () => {
      toast.loading("Uploading Track...");
    },
  });

  function ascendUploadProgress() {
    form.clearErrors();
    if (uploadProgress === "upload-track") {
      if (!form.getValues("soundTrack")) {
        form.setError("soundTrack", {
          message: "Please upload your sound track",
        });
        return;
      }
      setUploadProgress("upload-cover");
      return;
    }
    if (uploadProgress === "upload-cover") {
      if (!form.getValues("albumCover")) {
        form.setError("albumCover", {
          message: "Please upload an album cover",
        });
        return;
      }
      setUploadProgress("enter-details");
      return;
    }
  }

  function descendUploadProgress() {
    if (uploadProgress === "upload-cover") {
      setUploadProgress("upload-track");
      return;
    }
    if (uploadProgress === "enter-details") {
      setUploadProgress("upload-cover");
      return;
    }
  }

  function onSubmit(values: z.infer<typeof TrackSchema>) {
    console.log(values);
    execute(values);
  }

  return (
    <Card
      className={cn(
        "mx-auto max-w-xl py-4 md:py-6",
        uploadProgress === "enter-details" ? "max-w-2xl" : null
      )}
    >
      <CardHeader className="px-4 md:px-6">
        <CardTitle>Upload a new track</CardTitle>
        <CardDescription>Share your track with the world</CardDescription>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              {uploadProgress === "upload-track" && (
                <FormField
                  control={form.control}
                  name="soundTrack"
                  render={() => (
                    <FormItem>
                      <FormLabel>Upload your sound track</FormLabel>
                      <FormControl>
                        <Dropzone
                          value={form.getValues("soundTrack")}
                          fileType="audio"
                          maxFileSize={10}
                          onChange={(value) => {
                            form.setValue("soundTrack", value as string);
                            form.clearErrors();
                          }}
                          onError={setError}
                          setFileDuration={(duration) =>
                            form.setValue("duration", Number(duration))
                          }
                          fileName={fileName}
                          setFileName={setFileName}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {uploadProgress === "upload-cover" && (
                <FormField
                  control={form.control}
                  name="albumCover"
                  render={() => (
                    <FormItem>
                      <FormLabel>Upload your album cover</FormLabel>
                      <FormControl>
                        <Dropzone
                          value={form.getValues("albumCover")}
                          fileType="image"
                          maxFileSize={1}
                          onChange={(value) => {
                            form.setValue("albumCover", value as string);
                            form.clearErrors();
                          }}
                          onError={setError}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {uploadProgress === "enter-details" && (
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Track Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your track name"
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
                </>
              )}

              {error && <FormError error={error} />}
              {success && <FormSuccess success={success} />}

              {uploadProgress !== "enter-details" && (
                <Button
                  type="button"
                  onClick={() => {
                    ascendUploadProgress();
                  }}
                >
                  Next
                </Button>
              )}

              {uploadProgress === "enter-details" && (
                <Button type="submit" disabled={status === "executing"}>
                  {status === "executing" ? "Uploading..." : "Upload Track"}
                </Button>
              )}

              {uploadProgress !== "upload-track" && (
                <Button
                  disabled={status === "executing"}
                  variant={"link"}
                  onClick={(e) => {
                    e.preventDefault();
                    descendUploadProgress();
                  }}
                  className="w-fit self-center"
                >
                  <ArrowLeftIcon /> Go back
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
