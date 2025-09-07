import { auth } from "@/server/auth";
import UserButton from "./user-button";
import Logo from "./logo";

export default async function Nav() {
  const session = await auth();

  return (
    <nav className="w-full flex items-center justify-between py-4">
      <Logo />
      <UserButton session={session} />
    </nav>
  );
}
