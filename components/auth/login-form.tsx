"use client";

import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import AuthCard from "./auth-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/types/login-schema";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { emailLogin } from "@/server/actions/email-login";
import { useState } from "react";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const { execute, status } = useAction(emailLogin, {
    onSuccess: (data) => {
      if (data.data?.error) {
        setError(data.data.error);
        setSuccess("");
      }
      if (data.data?.success) {
        setSuccess(data.data.success);
        setError("");

        if (data.data.success === "Log in complete")
          setTimeout(() => {
            router.push("/");
          }, 500);
      }
    },
  });

  function onSubmit(values: z.infer<typeof LoginSchema>) {
    const email = values.email.toLowerCase();
    execute({ ...values, email });
  }

  return (
    <AuthCard
      title="Welcome back"
      description="Please enter your details."
      linkText="Not registered? Get started."
      pageLink="/auth/register"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="someone@example.com"
                      autoComplete="email"
                      type="email"
                      {...field}
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
                      placeholder="********"
                      type="password"
                      autoComplete={"new-password"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant={"link"} className="w-fit p-0">
              <Link href={"/auth/reset"}>Forgot your password?</Link>
            </Button>

            {error && <FormError error={error} />}
            {success && <FormSuccess success={success} />}

            <Button disabled={status === "executing"}>Login</Button>
          </div>
        </form>
      </Form>
    </AuthCard>
  );
}
