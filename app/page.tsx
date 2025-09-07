import { auth } from "@/server/auth";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <h1 className="text-muted-foreground">
        {!session ? "This is home page" : `welcome back ${session.user?.name}`}
      </h1>
      {session && (
        <Image
          src={session.user?.image!}
          alt="profile pic"
          width={120}
          height={120}
        />
      )}
    </div>
  );
}
