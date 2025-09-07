import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function AuthButtons() {
  return (
    <div className="flex flex-col gap-2">
      <Button
        size={"icon"}
        variant={"outline"}
        className="w-full"
        onClick={() => signIn("google")}
      >
        Google
        <FcGoogle />
      </Button>
      <Button
        size={"icon"}
        variant={"outline"}
        className="w-full"
        onClick={() => signIn("github")}
      >
        Github
        <FaGithub />
      </Button>
    </div>
  );
}
