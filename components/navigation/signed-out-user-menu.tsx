import { LogIn } from "lucide-react";
import { SidebarGroup, SidebarGroupLabel } from "../ui/sidebar";

export default function SignedOutUserMenu() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="items-start gap-2">
        <LogIn /> Log in to like tracks, build playlists, and follow your
        favorite artists.
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
