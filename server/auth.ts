import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { accounts, users } from "./schema";
import { LoginSchema } from "@/types/login-schema";
import { db } from ".";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    accountsTable: accounts,
    usersTable: users,
  }),

  session: { strategy: "jwt" },
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,

  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      async authorize(credentials) {
        const { success, data } = LoginSchema.safeParse(credentials);

        if (success) {
          const user = await db.query.users.findFirst({
            where: eq(users.email, data.email),
          });

          if (!user || !user.password) return null;

          const passwordMatch = await compare(data.password, user.password);

          if (passwordMatch) return user;
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, token.sub),
      });

      if (!dbUser) return token;

      token.email = dbUser.email;
      token.name = dbUser.name;
      token.handle = dbUser.handle;
      token.image = dbUser.image;
      token.isOAuth = !dbUser.emailVerified;
      token.role = dbUser.role;
      return token;
    },
    async session({ token, session }) {
      if (session && token.sub) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.handle = token.handle as string;
        session.user.image = token.image as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.role = token.role as "user" | "admin";
      }

      return session;
    },
  },
});
