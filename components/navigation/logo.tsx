"use client";

import Link from "next/link";
import { SidebarTrigger } from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function Logo({ className }: { className?: string }) {
  const pathname = usePathname();
  const hideSidebar = pathname.includes("/auth");

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {!hideSidebar && (
        <SidebarTrigger className="hover:bg-primary/50 dark:hover:bg-primary/25" />
      )}
      <Link
        href={"/"}
        className="text-lg md:text-xl font-bold cursor-pointer hover:opacity-75 transition-all duration-300"
      >
        Waves Music
      </Link>
    </div>
  );
}
