import SettingsNav from "@/components/navigation/settings-nav";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <div className="max-w-2xl mx-auto">
      <SettingsNav />
      {children}
    </div>
  );
}
