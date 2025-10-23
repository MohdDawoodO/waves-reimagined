"use client";

import {
  Clock,
  Earth,
  Home,
  Link2,
  Lock,
  PlaySquare,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
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
import { PlaylistType } from "@/types/common-types";

export default function AppSidebar({
  session,
  userPlaylists,
  watchLaterPlaylist,
}: {
  session?: Session | null;
  watchLaterPlaylist: PlaylistType | undefined;
  userPlaylists?: PlaylistType[] | undefined;
}) {
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

  const playlists = userPlaylists?.map((playlist) => {
    return {
      path: `/playlist?list=${playlist.id}`,
      icon:
        playlist.visibility === "private"
          ? Lock
          : playlist.visibility === "unlisted"
            ? Link2
            : Earth,
      name: playlist.name,
    };
  });

  const watchLater = {
    path: `/playlist?list=${watchLaterPlaylist?.id}`,
    name: "Watch Later",
    icon: Clock,
  };

  const likedPlaylist = {
    path: `/playlist/liked`,
    name: "Liked Tracks",
    icon: ThumbsUp,
  };

  const subscriptions = [
    {
      path: "/profile/ibrshism",
      image:
        "https://lh3.googleusercontent.com/a/ACg8ocK6HMvZzozNdpyfkipdwUuv1ctBImh9yrX4l3JK0J_pkyOlEvU=s96-c",
      name: "Ibrahim",
    },
    { path: "/profile/pappartit", image: null, name: "Mohd Dawood" },
    {
      path: "/profile/airknight360",
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
            <SidebarGroupContainer
              title="Your Playlists"
              data={[likedPlaylist, watchLater, ...playlists!]}
            />
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
