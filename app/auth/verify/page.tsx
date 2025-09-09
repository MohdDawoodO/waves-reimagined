import EmailVerifyCard from "@/components/auth/email-verify-card";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function EmailVerify() {
  const session = await auth();

  if (session) redirect("/");

  return <EmailVerifyCard />;
}
