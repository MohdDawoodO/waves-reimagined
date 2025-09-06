"use client";

import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Nav() {
  const { theme, setTheme, systemTheme } = useTheme();
  const router = useRouter();

  const toggleTheme = () => {
    if (theme === "system") {
      setTheme(systemTheme === "dark" ? "light" : "dark");
      return;
    }
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="w-full flex items-center justify-between py-4">
      <h1
        className="text-lg font-bold cursor-pointer hover:opacity-75 transition-all duration-200"
        onClick={() => router.push("/")}
      >
        Waves Music
      </h1>

      <Button onClick={() => router.push("/auth/login")} className="group">
        <LogIn className="group-hover:translate-x-1 group-hover:scale-90 transition-all duration-200" />
        Log In
      </Button>
    </nav>
  );
}
