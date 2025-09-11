"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import AuthCard from "./auth-card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import z from "zod";
import { Button } from "../ui/button";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { PasswordResetSchema } from "@/types/passsword-reset-schema";
import { useAction } from "next-safe-action/hooks";
import { passwordReset } from "@/server/actions/password-reset";

export default function ResetForm() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const { execute, status } = useAction(passwordReset, {
    onSuccess: (data) => {
      if (data.data.error) {
        setError(data.data.error);
        setSuccess("");
      }
      if (data.data.success) {
        setSuccess(data.data.success);
        setError("");
      }
    },
  });

  function onSubmit(values: z.infer<typeof PasswordResetSchema>) {
    const refinedEmail = values.email.toLowerCase();

    execute({ email: refinedEmail });
  }

  return (
    <AuthCard title={"Enter your email"}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="someone@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <FormError error={error} />}
            {success && <FormSuccess success={success} />}
            <Button type="submit" disabled={status === "executing"}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </AuthCard>
  );
}
