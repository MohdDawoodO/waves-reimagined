import ProfileNav from "@/components/navigation/profile-nav";
import UserImage from "@/components/navigation/user-image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/server";
import { auth } from "@/server/auth";
import { users } from "@/server/schema";
import { eq } from "drizzle-orm";
import { MoveLeft } from "lucide-react";
import Link from "next/link";

export default async function ProfileLayout({
  params,
  children,
}: {
  params: Promise<{ handle: string }>;
  children: React.ReactNode;
}) {
  const parameter = await params;

  const user = await db.query.users.findFirst({
    where: eq(users.handle, parameter.handle),
  });

  const session = await auth();

  if (!user) {
    return (
      <div className="w-full absolute top-1/2 left-1/2 -translate-1/2 flex flex-col items-center justify-center text-muted-foreground">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl">404</h2>
          <div className="w-[2px] h-10 bg-muted" />
          <h3 className="text-sm">This profile doesn&apos;t exist</h3>
        </div>
        <Button variant={"link"}>
          <MoveLeft />
          <Link href={"/"}>Go back</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8">
      <div className="flex flex-col items-center gap-2 sm:gap-4">
        <UserImage
          name={user.name!}
          image={user.image}
          className="w-18 h-18 text-3xl sm:w-24 sm:h-24 sm:text-4xl"
        />
        <div className="text-center">
          <h2 className="text-sm">{user?.name}</h2>
          <h2 className="text-xs text-muted-foreground">@{user?.handle}</h2>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:gap-4 w-full">
        <ProfileNav handle={parameter.handle} sesssion={session} />
        <Separator />
      </div>
      <main>{children}</main>
    </div>
  );
}
