"use client";

import { MoveLeft } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";

export function NotFoundMessage({
  children,
  backURL,
}: {
  children?: React.ReactNode | undefined;
  backURL?: string | undefined;
}) {
  return (
    <div className="w-full absolute top-1/2 left-1/2 -translate-1/2 flex flex-col items-center justify-center text-muted-foreground">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl">404</h2>
        <div className="w-[2px] h-10 bg-muted" />
        <h3 className="text-sm">{children}</h3>
      </div>
      <Button variant={"link"}>
        <MoveLeft />
        <Link href={backURL || "/"}>Go back</Link>
      </Button>
    </div>
  );
}
