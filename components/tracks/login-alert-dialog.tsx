"use client";

import { LogIn } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

export function LoginAlertDialog({
  session,
  children,
}: {
  session: Session | null | undefined;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <AlertDialog>
      {children}
      {!session && (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive text-base">
              Please log in to perform this action.
            </AlertDialogTitle>
            <AlertDialogDescription>
              Log in to like tracks, build playlists, and follow your favorite
              artists.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex group cursor-pointer"
              onClick={() => router.push("/auth/login")}
            >
              <LogIn className="group-hover:scale-90 group-hover:translate-x-1 transition-transform duration-200" />
              Log in
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
}

export function LoginAlertDialogTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>;
}
