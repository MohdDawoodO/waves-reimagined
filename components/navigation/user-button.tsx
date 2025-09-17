"use client";

import {
  ChartColumnIcon,
  LogIn,
  LogOut,
  Moon,
  Music,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { Button } from "../ui/button";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UserImage from "./user-image";
import { useTheme } from "next-themes";
import { Switch } from "../ui/switch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UserButton({ session }: { session: Session | null }) {
  const router = useRouter();

  const { setTheme, systemTheme, theme } = useTheme();

  function toggleTheme() {
    if (theme === "system") {
      setTheme(systemTheme === "dark" ? "light" : "dark");
      return;
    }

    setTheme(theme === "dark" ? "light" : "dark");
  }

  function isDark() {
    if (theme === "system") {
      return systemTheme === "dark" ? true : false;
    }
    return theme === "dark" ? true : false;
  }

  const redirectToProfileLink = (path: string) => {
    router.push(session?.user.handle ? path : "/settings/account");
    if (!session?.user.handle) {
      toast.error("You need a handle to create a public profile");
    }
  };

  if (session && session.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserImage
            image={session.user.image!}
            name={session.user.name!}
            className="cursor-pointer"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="p-2 w-56">
          <DropdownMenuLabel className="flex flex-col items-center py-4">
            <UserImage
              image={session.user.image!}
              name={session.user.name!}
              className="mb-2"
            />
            <div className="flex flex-col items-center gap-1">
              <h2 className="text-sm">{session.user?.name}</h2>
              <p className="text-muted-foreground text-xs text-wrap">
                {session.user.handle
                  ? "@" + session.user.handle
                  : session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            className="group transition-all duration-200 ease-in-out cursor-pointer"
            onClick={() =>
              redirectToProfileLink(`/profile/${session.user.handle}/home`)
            }
          >
            <User className="mr-1 group-hover:scale-85 transition-transform duration-200" />
            My Profile
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuGroup>
            <DropdownMenuItem
              className="group transition-all duration-200 ease-in-out cursor-pointer"
              onClick={() =>
                redirectToProfileLink(`/profile/${session.user.handle}/tracks`)
              }
            >
              <Music className="mr-1 group-hover:scale-85 transition-transform duration-200" />
              My Tracks
            </DropdownMenuItem>

            <DropdownMenuItem
              className="group transition-all duration-200 ease-in-out cursor-pointer"
              onClick={() =>
                redirectToProfileLink(
                  `/profile/${session.user.handle}/analytics`
                )
              }
            >
              <ChartColumnIcon className="mr-1 group-hover:scale-85 transition-transform duration-200" />
              Analytics
            </DropdownMenuItem>

            <DropdownMenuItem
              className="group focus:text-yellow-600 dark:focus:text-blue-500 transition-all duration-200 ease-in-out justify-start"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <Moon className="group-hover:text-blue-500 group-hover:scale-90 mr-1 transition-all duration-200 text-muted-foreground hidden dark:flex" />
              <Sun className="group-hover:text-yellow-600 group-hover:scale-90 group-hover:rotate-15 mr-1 transition-all duration-200 dark:hidden" />
              Theme: {isDark() ? "Dark" : "Light"}
              <Switch
                className="scale-80 cursor-pointer"
                checked={isDark()}
                onCheckedChange={() => toggleTheme()}
              />
            </DropdownMenuItem>

            <DropdownMenuItem
              className="group transition-all duration-200 ease-in-out cursor-pointer"
              onClick={() => router.push(`/settings/profile`)}
            >
              <Settings className="group-hover:rotate-180 group-hover:scale-90 mr-1 transition-transform duration-200 ease-in-out" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            className="dark:focus:bg-destructive/20 focus:bg-destructive/25 group transition-all duration-200 ease-in-out cursor-pointer"
            onClick={() => signOut()}
          >
            <LogOut className="group-hover:scale-80 mr-1 transition-transform duration-200 ease-in-out" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link href={"/auth/login"}>
      <Button className="group scale-95 sm:scale-100">
        <LogIn className="group-hover:scale-90 group-hover:translate-x-1 transition-all duration-200" />
        Sign In
      </Button>
    </Link>
  );
}
