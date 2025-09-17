import { auth } from "@/server/auth";
import ProfileSettingForm from "./profile-settings-form";

export default async function ProfileSettings() {
  const session = await auth();

  return <ProfileSettingForm session={session} />;
}
