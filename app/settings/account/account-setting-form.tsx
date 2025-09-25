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
import { AccountSettingsSchema } from "@/types/account-settings-schema";
import z from "zod";
import { useState } from "react";
import { Session } from "next-auth";
import { useAction } from "next-safe-action/hooks";
import { updateAcountSettings } from "@/server/actions/update-account-settings";
import { toast } from "sonner";

export default function AccountSettingForm({
  session,
}: {
  session: Session | null;
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm({
    resolver: zodResolver(AccountSettingsSchema),
    defaultValues: {
      handle: session?.user.handle || undefined,
      password: undefined,
      newPassword: undefined,
      userID: session?.user.id,
    },
    mode: "onChange",
  });

  const { execute, status } = useAction(updateAcountSettings, {
    onSuccess: (data) => {
      toast.dismiss();
      if (data.data?.error) {
        setSuccess("");
        setError(data.data.error);
      }
      if (data.data?.success) {
        setError("");
        setSuccess(data.data.success);
      }
    },
    onExecute: () => {
      toast.loading("Updating Settings...");
    },
  });

  function onSubmit(values: z.infer<typeof AccountSettingsSchema>) {
    execute(values);
  }

  if (!session) return;

  return (
    <SettingsCard title="Account Settings">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="handle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Handle</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="johndoe00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="********"
                      type="password"
                      autoComplete="new password"
                      disabled={session.user.isOAuth}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="********"
                      type="password"
                      disabled={session.user.isOAuth}
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
              disabled={status === "executing" || !form.formState.isValid}
            >
              {status === "executing" ? "Updating..." : "Update Settings"}
            </Button>
          </div>
        </form>
      </Form>
    </SettingsCard>
  );
}
