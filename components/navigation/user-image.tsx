import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "../ui/avatar";
import Image from "next/image";

export default function UserImage({
  image,
  name,
  className,
}: {
  image?: string | null;
  name: string;
  className?: string;
}) {
  return (
    <Avatar className={cn(className)}>
      {image ? (
        <Image
          src={image}
          alt={name}
          width={100}
          height={100}
          priority
          className="object-cover"
        />
      ) : (
        <div className="font-bold w-full h-full flex items-center justify-center bg-primary/85 dark:bg-primary/75">
          <p className="text-black/75 ">{name.charAt(0).toUpperCase()}</p>
        </div>
      )}
    </Avatar>
  );
}
