import { auth } from "@/server/auth";
import AppSidebar from "../navigation/app-sidebar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";

export default async function AppSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SidebarProvider className="h-[100vh] overflow-hidden">
      <AppSidebar session={session} />
      <SidebarInset className="md:pr-2 relative">{children}</SidebarInset>
    </SidebarProvider>
  );
}
