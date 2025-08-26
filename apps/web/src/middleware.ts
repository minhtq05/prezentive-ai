import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const privateRoutes = ["/home", "/projects", "/editor", "/my-gallery"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  let isPrivate = false;

  for (const route of privateRoutes) {
    if (path.startsWith(route)) {
      isPrivate = true;
      break;
    }
  }

  if (isPrivate) {
    const cookies = getSessionCookie(request);

    if (!cookies) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
