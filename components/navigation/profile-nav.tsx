"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Session } from "next-auth";

export default function ProfileNav({
  handle,
  sesssion,
}: {
  handle: string;
  sesssion: Session | null;
}) {
  const pathname = usePathname();

  const profileLinks = [
    { name: "Home", path: `/profile/${handle}/home` },
    { name: "Tracks", path: `/profile/${handle}/tracks` },
    { name: "Playlists", path: `/profile/${handle}/playlists` },
  ];

  if (sesssion?.user.handle === handle) {
    profileLinks.push({
      name: "Analytics",
      path: `/profile/${handle}/analytics`,
    });
  }

  return (
    <nav className="overflow-x-auto">
      <ul className="flex justify-evenly md:justify-center gap-12 text-sm md:gap-20">
        {profileLinks.map((link) => (
          <li key={link.name}>
            <Link href={link.path} scroll={false}>
              {link.name}
            </Link>
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
