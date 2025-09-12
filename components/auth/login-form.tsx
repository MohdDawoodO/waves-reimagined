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
import { useEffect, useState } from "react";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verification, setVerification] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalID, setIntervalID] = useState<NodeJS.Timeout>();

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
            router.refresh();
          }, 500);
      }
      if (data.data.verification) {
        setSuccess(data.data.verification);
        setError("");
        setVerification(true);
        setTimer(60);
        clearInterval(intervalID);

        const id = setInterval(() => {
          setTimer((prev) => prev - 1);
        }, 1000);

        setIntervalID(id);
      }
    },
  });

  function onSubmit(values: z.infer<typeof LoginSchema>) {
    const email = values.email.toLowerCase();
    execute({ ...values, email });
  }

  useEffect(() => {
    if (timer <= 0) {
      clearInterval(intervalID);
    }
  }, [timer, intervalID]);

  return (
    <AuthCard
      title="Welcome back"
      description={
        verification
          ? "Enter your two factor code"
          : "Please enter your details."
      }
      linkText="Not registered? Get started."
      pageLink="/auth/register"
      withSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            {!verification && (
              <>
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
              </>
            )}

            {verification && (
              <div className="w-fit flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="twoFactorCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputOTP
                          minLength={6}
                          maxLength={6}
                          {...field}
                          required
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between">
                  <Button
                    variant={"link"}
                    className="p-0"
                    disabled={timer > 0}
                    onClick={(e) => {
                      e.preventDefault();
                      const email = form.getValues("email").toLowerCase();
                      form.setValue("twoFactorCode", "");
                      execute({
                        email,
                        password: form.getValues("password"),
                      });
                    }}
                  >
                    Resend OTP?
                  </Button>
                  <p className="text-sm">
                    00:{timer >= 10 ? timer : "0" + timer}
                  </p>
                </div>
              </div>
            )}

            {error && <FormError error={error} />}
            {success && <FormSuccess success={success} />}

            <Button disabled={status === "executing"} type="submit">
              Login
            </Button>
          </div>
        </form>
      </Form>
    </AuthCard>
  );
}
