import { Earth, Link2Icon, LockIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { VscLoading } from "react-icons/vsc";

export default function Playlist({
  id,
  name,
  visibility,
}: {
  id: string;
  name: string;
  visibility: "public" | "unlisted" | "private";
}) {
  const [loading, setLoading] = useState(false);

  return (
    <div key={id} className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-base">
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
        className="text-xs bg-foreground/90 hover:bg-foreground/80 text-background"
        onClick={() => setLoading(!loading)}
      >
        {loading ? (
          <VscLoading className="animate-spin w-4 h-4 stroke-1" />
        ) : (
          "Add"
        )}
      </Button>
    </div>
  );
}
