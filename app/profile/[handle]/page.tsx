import { redirect } from "next/navigation";

export default async function UserProfile({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const parameter = await params;

  redirect(`/profile/${parameter.handle}/home`);
}
