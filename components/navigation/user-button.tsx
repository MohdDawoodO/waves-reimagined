"use client";

import { LogIn, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ({ session }: { session?: Session | null }) {
  const router = useRouter();

  if (session) {
    return (
      <Button className="group" onClick={() => signOut()}>
        <LogOut className="group-hover:scale-90 group-hover:translate-x-1 transition-all duration-200" />
        Log Out
      </Button>
    );
  }

  return (
    <Button className="group" onClick={() => router.push("/auth/login")}>
      <LogIn className="group-hover:scale-90 group-hover:translate-x-1 transition-all duration-200" />
      Log In
    </Button>
  );
}
