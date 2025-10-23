import ProfileNav from "@/components/navigation/profile-nav";
import UserImage from "@/components/navigation/user-image";
import { NotFoundMessage } from "@/components/ui/not-found-message";
import { Separator } from "@/components/ui/separator";
import { db } from "@/server";
import { auth } from "@/server/auth";
import { users } from "@/server/schema";
import { eq } from "drizzle-orm";

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
    return <NotFoundMessage>This profile doesn&apos;t exist</NotFoundMessage>;
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
      <main className="w-full">{children}</main>
    </div>
  );
}
