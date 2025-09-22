import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import UploadForm from "./upload-form";

export default async function Upload() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  return <UploadForm session={session} />;
}
