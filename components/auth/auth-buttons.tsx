import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function AuthButtons() {
  return (
    <div className="flex gap-4">
      <Button
        variant={"outline"}
        className="flex-1"
        onClick={() => signIn("google")}
      >
        Google
        <FcGoogle />
      </Button>
      <Button
        variant={"outline"}
        className="flex-1"
        onClick={() => signIn("github")}
      >
        Github
        <FaGithub />
      </Button>
    </div>
  );
}
