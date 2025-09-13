"use client";

import { Home, PlaySquare, ThumbsUp, TrendingUp } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarSeparator,
} from "../ui/sidebar";

import Logo from "./logo";
import SidebarGroupContainer from "./sidebar-group-container";

export default function AppSidebar() {
  const pageLinks = [
    { path: "/", icon: Home, name: "Home" },
    { path: "/trending", icon: TrendingUp, name: "Trending" },
    { path: "/subscriptions", icon: PlaySquare, name: "Subscriptions" },
  ];

  const playlists = [
    { path: "/", icon: ThumbsUp, name: "Liked Musics" },
    { path: "/", icon: TrendingUp, name: "Watch Later" },
    { path: "/", icon: PlaySquare, name: "Other playlist..." },
  ];

  const subscriptions = [
    { path: "/", image: null, name: "Pappartit" },
    { path: "/", image: null, name: "Mohd Dawood" },
    { path: "/", image: null, name: "AirKnight" },
    { path: "/", image: null, name: "View more..." },
  ];

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="md:hidden">
        <Logo className="py-3" />
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <SidebarGroupContainer title="Waves Music" data={pageLinks} />
        <SidebarSeparator />

        <SidebarGroupContainer title="Your Playlists" data={playlists} />
        <SidebarSeparator />

        <SidebarGroupContainer
          title="Your Subscriptions"
          data={subscriptions}
        />
        <SidebarSeparator />
      </SidebarContent>
    </Sidebar>
  );
}
