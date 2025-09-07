"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Logo() {
  const router = useRouter();

  return (
    <Link
      href={"/"}
      className="text-lg md:text-xl font-bold cursor-pointer hover:opacity-75 transition-all duration-300"
    >
      Waves Music
    </Link>
  );
}
