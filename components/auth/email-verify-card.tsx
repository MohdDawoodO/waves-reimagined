"use client";

import FormError from "@/components/auth/form-error";
import FormSuccess from "@/components/auth/form-success";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { emailLogin } from "@/server/actions/email-login";
import { verifyEmail } from "@/server/actions/verify-email";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EmailVerifyCard() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const password = searchParams.get("password");
  const email = searchParams.get("email");

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
      }
    },
  });

  const { execute: login } = useAction(emailLogin);

  useEffect(() => {
    execute({ email: email!, token: token! });
    login({ email: email!, password: password! });
  }, [execute, login]);

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Verifying your email...</CardTitle>
      </CardHeader>
      <CardContent>
        {missingCredentials && (
          <FormError error="Invalid link. Please check the URL." />
        )}
        {error && <FormError error={error} />}
        {success && <FormSuccess success={success} />}
      </CardContent>
    </Card>
  );
}
