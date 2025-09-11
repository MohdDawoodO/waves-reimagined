"use client";

import { useRouter, useSearchParams } from "next/navigation";
import AuthCard from "./auth-card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/types/new-password-schema";
import z from "zod";
import { Input } from "../ui/input";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { Button } from "../ui/button";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { newPassword } from "@/server/actions/new-password";

export default function NewPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const missingCredentials = !email || !token;

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      email: email!,
      token: token!,
    },

    mode: "onChange",
  });

  const { execute, status } = useAction(newPassword, {
    onSuccess: (data) => {
      if (data.data?.error) {
        setError(data.data.error);
        setSuccess("");
      }
      if (data.data.success) {
        setSuccess(data.data.success);
        setError("");

        setTimeout(() => {
          router.push("/auth/login");
        }, 500);
      }
    },
  });

  function onSubmit(values: z.infer<typeof NewPasswordSchema>) {
    const refinedEmail = values.email.toLowerCase();

    if (!missingCredentials) {
      execute({ ...values, email: refinedEmail });
    }
  }

  return (
    <AuthCard title="Enter new password">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="********"
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {missingCredentials && (
              <FormError error="Invalid link. Please check the URL." />
            )}

            {error && <FormError error={error} />}
            {success && <FormSuccess success={success} />}
            <Button type="submit" disabled={status === "executing"}>
              Reset Password
            </Button>
          </div>
        </form>
      </Form>
    </AuthCard>
  );
}
