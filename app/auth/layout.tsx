import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export const revalidate = 60;

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session) redirect("/");

  return <>{children}</>;
}
