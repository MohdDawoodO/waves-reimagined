import RegisterForm from "@/components/auth/register-form";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Register() {
  const session = await auth();
  if (session) redirect("/");

  return <RegisterForm />;
}
