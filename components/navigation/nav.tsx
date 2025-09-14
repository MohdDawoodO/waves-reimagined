import { auth } from "@/server/auth";
import UserButton from "./user-button";
import Logo from "./logo";

export default async function Nav() {
  const session = await auth();

  return (
    <nav className="w-full flex items-center justify-between pb-8 sticky top-0 bg-background">
      <Logo />
      <UserButton session={session} />
    </nav>
  );
}
