import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

// 1. Specify protected and public routes
const protectedRoutes = ["/home"];
const publicRoutes = ["/login", "/signup", "/home/event", "/home/blog"];

export default async function proxy(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;

  // Code logic to handle nested routes in blog and event and allow access to event/[id] and blog/[id] for public routes
  const splittedPath = path.split("/");
  if (splittedPath.length > 2) {
    splittedPath.pop();
  }
  const reconstructedPath = splittedPath.join("/");
  const isPublicRoute = publicRoutes.includes(reconstructedPath);

  const isProtectedRoute =
    protectedRoutes.some((route) => path.startsWith(route)) && !isPublicRoute;

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  // Redirect to /login if accessing the root route without a session
  if (!session?.user && path === "/") {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
  if (session?.user && path === "/") {
    return NextResponse.redirect(new URL("/home", req.nextUrl));
  }

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.user) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 5. Redirect to /home if the user is authenticated
  if (isPublicRoute && session?.user && !path.startsWith("/home")) {
    return NextResponse.redirect(new URL("/home", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)",
  ],
};
