import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function UserAnalytics({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const parameter = await params;

  const session = await auth();

  if (!session) return;

  if (session.user.handle !== parameter.handle) {
    redirect(`/profile/${parameter.handle}/home`);
  }

  return <div>profile analytics page</div>;
}
