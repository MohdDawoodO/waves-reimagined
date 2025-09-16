"use client";

import { Home, PlaySquare, ThumbsUp, TrendingUp } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarSeparator,
  useSidebar,
} from "../ui/sidebar";

import Logo from "./logo";
import SidebarGroupContainer from "./sidebar-group-container";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Session } from "next-auth";
import SignedOutUserMenu from "./signed-out-user-menu";

export default function AppSidebar({ session }: { session?: Session | null }) {
  const pageLinks = [
    { path: "/", icon: Home, name: "Home" },
    { path: "/trending", icon: TrendingUp, name: "Trending" },
  ];

  const signedUserPageLinks = [
    ...pageLinks,
    {
      icon: PlaySquare,
      name: "Subscriptions",
      path: "/subscriptions",
    },
  ];

  const playlists = [
    { path: "/playlists?p=67281", icon: ThumbsUp, name: "Liked Musics" },
    {
      path: "/playlists?p=21789",
      icon: TrendingUp,
      name: "Watch Later",
    },
    {
      path: "/profile/pappartit/playlists",
      icon: PlaySquare,
      name: "Other playlist...",
    },
  ];

  const subscriptions = [
    {
      path: "/profile/ibrshism/home",
      image:
        "https://lh3.googleusercontent.com/a/ACg8ocK6HMvZzozNdpyfkipdwUuv1ctBImh9yrX4l3JK0J_pkyOlEvU=s96-c",
      name: "Ibrahim",
    },
    { path: "/profile/pappartit/home", image: null, name: "Mohd Dawood" },
    {
      path: "/profile/airknight360/home",
      image:
        "https://lh3.googleusercontent.com/a/ACg8ocKnnJw7J3rZJd1r8EejMWMQlGSLwRKAXemPGYuJBpTf2Ig1SDdX=s96-c",
      name: "AirKnight",
    },
    { path: "/view-more", image: null, name: "View more..." },
  ];

  const { setOpen } = useSidebar();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("/auth")) {
      setOpen(false);
    }
  }, [pathname, setOpen]);

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="md:hidden">
        <Logo className="py-3" />
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <SidebarGroupContainer
          title="Waves Music"
          data={session ? signedUserPageLinks : pageLinks}
        />
        <SidebarSeparator />

        {session && (
          <>
            <SidebarGroupContainer title="Your Playlists" data={playlists} />
            <SidebarSeparator />

            <SidebarGroupContainer
              title="Your Subscriptions"
              data={subscriptions}
            />
            <SidebarSeparator />
          </>
        )}

        {!session && <SignedOutUserMenu />}
      </SidebarContent>
    </Sidebar>
  );
}
