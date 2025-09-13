"use client";

import AppSidebar from "../navigation/app-sidebar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";

export default function AppSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="h-[100vh] overflow-hidden">
      <AppSidebar />
      <SidebarInset className="md:pr-2 relative">{children}</SidebarInset>
    </SidebarProvider>
  );
}
