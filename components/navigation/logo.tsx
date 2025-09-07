"use client";

import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href={"/"}
      className="text-lg md:text-xl font-bold cursor-pointer hover:opacity-75 transition-all duration-300"
    >
      Waves Music
    </Link>
  );
}
