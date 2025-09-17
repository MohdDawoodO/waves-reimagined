"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

export default function SettingsNav() {
  const pathname = usePathname();
  const settingsLinks = [
    { name: "Profile", path: "/settings/profile" },
    { name: "Account", path: "/settings/account" },
  ];

  return (
    <nav className="pb-4">
      <ul className="flex gap-12 text-sm">
        {settingsLinks.map((link) => (
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
