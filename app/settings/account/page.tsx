import { auth } from "@/server/auth";
import AccountSettingForm from "./account-setting-form";

export default async function AccountSettings() {
  const session = await auth();

  return <AccountSettingForm session={session} />;
}
