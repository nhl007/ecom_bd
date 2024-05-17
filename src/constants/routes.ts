/**
 * All public routes.
 *
 * These routes doesn't require users to be authenticated.
 * @type {string[]}
 */
export const publicRoutes: string[] = ["/", "/password_reset"];

/**
 * All authentication routes.
 *
 * These routes are used to get users authenticated.
 * @type {string[]}
 */
export const authRoutes: string[] = [
  "/sign-in",
  "/sign-up",
  "/verify",
  "/auth/error",
];

/**
 * Prefix of api auth routes.
 *
 * These routes should never be blocked.
 * @type {string}
 */
export const apiAuthRoutePrefix: string = "api/auth";

/**
 * Default redirect url after authenticating users.
 * @type {string}
 */
export const DEFAULT_REDIRECT_URL: string = "/admin";
