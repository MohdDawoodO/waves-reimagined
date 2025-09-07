import { auth } from "@/server/auth";
import { Input } from "../ui/input";
import AuthCard from "./auth-card";
import { redirect } from "next/navigation";

export default async function LoginForm() {
  const session = await auth();

  if (session) redirect("/");

  return (
    <AuthCard
      title="Welcome back"
      description="Please enter your details"
      linkText="Forgot Password?"
      pageLink="/auth/reset"
    >
      <Input className="font-normal" />
    </AuthCard>
  );
}
