import { auth } from "@/server/auth";
import AppSidebar from "../navigation/app-sidebar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { db } from "@/server";
import { and, eq, ne } from "drizzle-orm";
import { playlists } from "@/server/schema";
import { PlaylistType } from "@/types/common-types";

export default async function AppSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  let userPlaylists: PlaylistType[] = [];
  let watchLaterPlaylist: PlaylistType | undefined = undefined;

  const session = await auth();

  if (session) {
    userPlaylists = await db.query.playlists.findMany({
      where: and(
        eq(playlists.userID, session.user.id),
        ne(playlists.name, "Watch Later")
      ),
      orderBy: (playlist, { desc }) => desc(playlist.createdOn),
      limit: 3,
    });

    watchLaterPlaylist = await db.query.playlists.findFirst({
      where: and(
        eq(playlists.userID, session.user.id),
        eq(playlists.name, "Watch Later")
      ),
    });
  }

  return (
    <SidebarProvider className="h-[100vh] overflow-hidden">
      <AppSidebar
        session={session}
        userPlaylists={userPlaylists}
        watchLaterPlaylist={watchLaterPlaylist}
      />
      <SidebarInset className="md:pr-2 relative">{children}</SidebarInset>
    </SidebarProvider>
  );
}
