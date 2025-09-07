"use client";

import { useRouter } from "next/navigation";

export default function Logo() {
  const router = useRouter();

  return (
    <h1
      className="text-lg md:text-xl font-bold cursor-pointer hover:opacity-75 transition-all duration-300"
      onClick={() => router.push("/")}
    >
      Waves Music
    </h1>
  );
}
