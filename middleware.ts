import { withAuth } from "next-auth/middleware";

export default withAuth(
  // Custom redirect logic
  function middleware(req) {},
  {
    callbacks: {
      authorized: ({ token }) => !!token, // only allow if session token exists
    },
  }
);

export const config = {
  matcher: [
    // protect everything except login/register/api/auth
    "/((?!login|register|api/auth|api/register|api/login).*)",
  ],
};
