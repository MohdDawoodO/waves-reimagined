"use client";

import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import AuthCard from "./auth-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
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
import { RegisterSchema } from "@/types/register-schema";
import { useState } from "react";
import FormSuccess from "./form-success";
import FormError from "./form-error";
import { emailRegister } from "@/server/actions/email-register";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const { execute, status } = useAction(emailRegister, {
    onSuccess: (data) => {
      if (data.data?.error) {
        setError(data.data.error);
        setSuccess("");
      }
      if (data.data?.success) {
        setSuccess(data.data.success);
        setError("");
        setTimeout(() => {
          router.push("/auth/login");
        }, 500);
      }
    },
  });

  function onSubmit(values: z.infer<typeof RegisterSchema>) {
    const email = values.email.toLowerCase();
    execute({ ...values, email });
  }

  return (
    <AuthCard
      title="Register"
      description="Please enter your details."
      linkText="Already have an account? Log in."
      pageLink="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      type="text"
                      {...field}
                      autoComplete="username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
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

            {error && <FormError error={error} />}
            {success && <FormSuccess success={success} />}

            <Button disabled={status === "executing"}>Register</Button>
          </div>
        </form>
      </Form>
    </AuthCard>
  );
}
