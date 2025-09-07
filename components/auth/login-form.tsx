import { Input } from "../ui/input";
import AuthCard from "./auth-card";

export default async function LoginForm() {
  return (
    <AuthCard
      title="Welcome back"
      description="Please enter your details"
      linkText="Forgot Password?"
      pageLink="/auth/reset"
    >
      <Input className="font-normal" />
    </AuthCard>
  );
}
