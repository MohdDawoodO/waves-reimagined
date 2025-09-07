"use client";

import { LogIn, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function ({ session }: { session?: Session | null }) {
  if (session) {
    return (
      <Button className="group" onClick={() => signOut()}>
        <LogOut className="group-hover:scale-90 group-hover:translate-x-1 transition-all duration-200" />
        Log Out
      </Button>
    );
  }

  return (
    <Link href={"/auth/login"}>
      <Button className="group scale-95 sm:scale-100">
        <LogIn className="group-hover:scale-90 group-hover:translate-x-1 transition-all duration-200" />
        Log In
      </Button>
    </Link>
  );
}
