import { auth } from "@/server/auth";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  console.log(session);

  return (
    <div>
      <h1 className="text-muted-foreground">
        {!session ? "This is home page" : `welcome back ${session.user?.name}`}
      </h1>
      {session && session.user && session.user.image && (
        <Image
          src={session.user.image!}
          alt="profile pic"
          width={120}
          height={120}
        />
      )}

      {session && !session.user?.image && (
        <div className="p-1 w-8 h-8 flex items-center justify-center rounded-full bg-primary/25 font-bold text-white/75">
          {session.user?.name?.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
