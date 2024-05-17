// import bcrypt from "bcrypt";
import type { NextAuthConfig } from "next-auth";

export default {
  pages: {
    signIn: "/sign-in",
    error: "/auth/error",
    signOut: "/sign-in",
  },
  providers: [],
} satisfies NextAuthConfig;
