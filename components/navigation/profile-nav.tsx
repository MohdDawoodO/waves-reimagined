"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

export default function ProfileNav({ handle }: { handle: string }) {
  const pathname = usePathname();

  const profileLinks = [
    { name: "Home", path: `/profile/${handle}/home` },
    { name: "Tracks", path: `/profile/${handle}/tracks` },
    { name: "Playlists", path: `/profile/${handle}/playlists` },
  ];

  return (
    <nav>
      <ul className="flex gap-16 text-sm md:text-base md:gap-24">
        {profileLinks.map((link) => (
          <li key={link.name}>
            <Link href={link.path}>{link.name}</Link>
            {pathname === link.path && (
              <motion.div
                layoutId="profileNavLine"
                className="w-full h-1 bg-primary rounded"
              />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
