import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "../ui/avatar";

export default function UserImage({
  image,
  name,
  className,
}: {
  image: string | null;
  name: string;
  className?: string;
}) {
  return (
    <Avatar className={cn(className)}>
      {image ? (
        <AvatarImage src={image!}></AvatarImage>
      ) : (
        <div className="font-bold w-full h-full flex items-center justify-center bg-primary/85 dark:bg-primary/25">
          <p className="text-black/75 dark:text-white/75">
            {name.charAt(0).toUpperCase()}
          </p>
        </div>
      )}
    </Avatar>
  );
}
