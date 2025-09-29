import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  email: string;
  name: string;
  handle: string;
  image: string;
  isOAuth: boolean;
  profileDescription: string;
  role: "user" | "admin";
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

// The `JWT` interface can be found in the `next-auth/jwt` submodule
