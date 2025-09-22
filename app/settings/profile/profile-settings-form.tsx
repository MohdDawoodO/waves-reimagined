"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import SettingsCard from "../settings-card";
import FormError from "@/components/auth/form-error";
import FormSuccess from "@/components/auth/form-success";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState } from "react";
import { Session } from "next-auth";
import { ProfileSettingsSchema } from "@/types/profile-settings-schema";
import UserImage from "@/components/navigation/user-image";
import UploadButton from "@/components/ui/upload-button";
import { useAction } from "next-safe-action/hooks";
import { updateProfileSettings } from "@/server/actions/update-profile-settings";

export default function ProfileSettingForm({
  session,
}: {
  session: Session | null;
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm({
    resolver: zodResolver(ProfileSettingsSchema),
    defaultValues: {
      displayName: session?.user.name,
      profileDescription: undefined,
      avatar: session?.user.image || undefined,
      userID: session?.user.id,
    },
    mode: "onChange",
  });

  const { execute, status } = useAction(updateProfileSettings, {
    onSuccess: (data) => {
      if (data.data.error) {
        setSuccess("");
        setError(data.data.error);
      }
      if (data.data.success) {
        setError("");
        setSuccess(data.data.success);
      }
    },
  });

  function onSubmit(values: z.infer<typeof ProfileSettingsSchema>) {
    console.log(values);
    execute(values);
  }

  if (!session) return;

  return (
    <SettingsCard title="Profile Settings">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="John Doe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <UserImage
                        className="w-10 h-10"
                        name={session.user.name}
                        image={form.getValues("avatar")}
                      />
                      <UploadButton
                        onChange={(image) =>
                          form.setValue("avatar", image as string)
                        }
                        onError={setError}
                      >
                        Upload
                      </UploadButton>
                      <Button
                        variant={"link"}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          form.setValue("avatar", "");
                        }}
                      >
                        Remove avatar
                      </Button>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        type="hidden"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profileDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Add a short bio (max 200 characters)"
                      disabled={!session.user.handle}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <FormError error={error} />}
            {success && <FormSuccess success={success} />}

            <Button
              type="submit"
              disabled={!form.formState.isValid || status === "executing"}
            >
              {status === "executing" ? "Updating..." : "Update Settings"}
            </Button>
          </div>
        </form>
      </Form>
    </SettingsCard>
  );
}
