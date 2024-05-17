import NextAuth from "next-auth";
import authConfig from "./configs/auth.config";

import {
  apiAuthRoutePrefix,
  DEFAULT_REDIRECT_URL,
  authRoutes,
} from "./constants/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthRoutePrefix);
  if (isApiAuthRoute) return;

  const isLoggedIn = !!req.auth;

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  if (isAuthRoute) {
    if (isLoggedIn)
      return Response.redirect(new URL(DEFAULT_REDIRECT_URL, nextUrl));

    return;
  }

  const isAdminRoutes = nextUrl.pathname.includes("admin");

  if (!isLoggedIn && isAdminRoutes)
    return Response.redirect(new URL("/sign-in", nextUrl));

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
