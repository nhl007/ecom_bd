import bcrypt from "bcrypt";
import NextAuth, { AuthError } from "next-auth";
import authConfig from "./auth.config";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "./db";
import credentials from "next-auth/providers/credentials";
import { getUserByEmail, getUserById } from "@/db/users.query";
import { users } from "@/db/users.schema";
import { sql } from "drizzle-orm";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  events: {
    async linkAccount({ user }) {
      await db
        .update(users)
        .set({
          emailVerified: new Date(),
        })
        .where(sql`${users.id} = ${user.id}`);
    },
  },
  providers: [
    credentials({
      async authorize(credentials) {
        const { email, password } = credentials;

        if (!email || !password)
          throw new AuthError("CredentialsSignin", {
            cause: {
              err: {
                message: "Missing Credentials!",
              },
            },
          });

        const user = await getUserByEmail(email as string);

        if (!user || !user.password || !user.email)
          throw new AuthError("CredentialsSignin", {
            cause: {
              err: {
                message: "No existing user found!",
              },
            },
          });

        const passwordMatch = await bcrypt.compare(
          password as string,
          user.password
        );

        if (!passwordMatch)
          throw new AuthError("CredentialsSignin", {
            cause: {
              err: {
                message: "Invalid Credentials!",
              },
            },
          });

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);

      if (!existingUser)
        throw new AuthError("CredentialsSignin", {
          cause: {
            err: {
              message: "No user found!",
            },
          },
        });

      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) session.user.id = token.sub;
      if (token.role && session.user) {
        session.user.role = token.role as "USER" | "ADMIN";
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await getUserById(token.sub);
      if (!user) return token;
      token.role = user.role;
      return token;
    },
  },
});
