import { Earth, Link2Icon, LockIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Dispatch, useState } from "react";
import { VscLoading } from "react-icons/vsc";
import { PlaylistTrackType } from "@/types/common-types";
import { useAction } from "next-safe-action/hooks";
import { addToPlaylistHandler } from "@/server/actions/add-to-playlist-handler";
import { toast } from "sonner";
import { SetStateAction } from "jotai";

export default function Playlist({
  id,
  name,
  track,
  trackID,
  visibility,
  executing,
  setExecuting,
}: {
  id: string;
  name: string;
  track: PlaylistTrackType;
  trackID: string;
  visibility: "public" | "unlisted" | "private";
  executing: boolean;
  setExecuting: Dispatch<SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useState(false);

  const { execute } = useAction(addToPlaylistHandler, {
    onSuccess: (data) => {
      toast.dismiss();
      setLoading(false);
      setExecuting(false);
      if (data.data?.error) {
        toast.error(data.data.error);
      }
      if (data.data?.success) {
        toast.success(data.data.success);
      }
    },
    onExecute: () => {
      setLoading(true);
      setExecuting(true);
    },
  });

  return (
    <div key={id} className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm flex-10">
        <h2>{name}</h2>
        {visibility === "public" ? (
          <Earth size={16} />
        ) : visibility === "unlisted" ? (
          <Link2Icon size={16} />
        ) : (
          <LockIcon size={16} />
        )}
      </div>
      <Button
        size="sm"
        className="text-xs bg-foreground/90 hover:bg-foreground/80 text-background scale-95 w-18"
        disabled={executing}
        onClick={() => execute({ playlistID: id, trackID })}
      >
        {loading ? (
          <VscLoading className="animate-spin w-4 h-4 stroke-1" />
        ) : track ? (
          "Remove"
        ) : (
          "Add"
        )}
      </Button>
    </div>
  );
}
