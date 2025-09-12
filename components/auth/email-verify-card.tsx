"use client";

import FormError from "@/components/auth/form-error";
import FormSuccess from "@/components/auth/form-success";
import { emailLogin } from "@/server/actions/email-login";
import { verifyEmail } from "@/server/actions/verify-email";
import { useAction } from "next-safe-action/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AuthCard from "./auth-card";

export default function EmailVerifyCard() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const password = searchParams.get("password");
  const email = searchParams.get("email");
  const router = useRouter();

  const missingCredentials = !token || !password || !email;

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { execute } = useAction(verifyEmail, {
    onSuccess: (data) => {
      if (data.data.error) {
        setError(data.data.error);
        setSuccess("");
      }
      if (data.data.success) {
        setSuccess(data.data.success);
        setError("");
        login({ email: email!, password: password! });
      }
    },
  });

  const { execute: login } = useAction(emailLogin, {
    onSuccess: () => {
      setTimeout(() => {
        router.push("/");
      }, 500);
    },
  });

  useEffect(() => {
    if (!missingCredentials) {
      execute({ email: email!, token: token! });
    }
  }, [execute, email, token, missingCredentials]);

  return (
    <AuthCard title="Verifying your email...">
      {missingCredentials && (
        <FormError error="Invalid link. Please check the URL." />
      )}
      {error && <FormError error={error} />}
      {success && <FormSuccess success={success} />}
    </AuthCard>
  );
}
