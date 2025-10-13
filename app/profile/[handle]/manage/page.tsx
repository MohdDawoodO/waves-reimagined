import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function ManageContent({
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

  return <div>profile manage page</div>;
}
