"use client";

import {
  ChartColumnIcon,
  LogIn,
  LogOut,
  Moon,
  Music,
  Settings,
  Sun,
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

export default function UserButton({ session }: { session: Session | null }) {
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
        <DropdownMenuContent align="end" className="p-2 w-50">
          <DropdownMenuLabel className="flex flex-col items-center py-4">
            <UserImage
              image={session.user.image!}
              name={session.user.name!}
              className="mb-2"
            />
            <div className="flex flex-col items-center gap-1">
              <h2 className="text-sm">{session.user?.name}</h2>
              <p className="text-muted-foreground text-xs text-wrap">
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="group transition-all duration-200 ease-in-out cursor-pointer">
            My Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="group transition-all duration-200 ease-in-out cursor-pointer">
              <Music className="mr-1 group-hover:scale-85 transition-transform duration-200" />
              My Musics
            </DropdownMenuItem>
            <DropdownMenuItem className="group transition-all duration-200 ease-in-out cursor-pointer">
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
            <DropdownMenuItem className="group transition-all duration-200 ease-in-out cursor-pointer">
              <Settings className="group-hover:rotate-180 group-hover:scale-90 mr-1 transition-transform duration-200 ease-in-out" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
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
