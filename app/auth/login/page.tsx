import LoginForm from "@/components/auth/login-form";
import { auth } from "@/server/auth";

export default async function Login() {
  const session = await auth();

  return <LoginForm />;
}
