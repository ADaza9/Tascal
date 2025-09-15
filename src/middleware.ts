import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";

// Define role hierarchy - higher numbers = more permissions
const ROLE_HIERARCHY = {
  superAdmin: 3,
  supervisor: 2,
  technician: 1,
} as const;

type Role = keyof typeof ROLE_HIERARCHY;

// Define route protection rules
const PROTECTED_ROUTES = {
  "/admin": ["superAdmin"],
  "/supervisor": ["superAdmin", "supervisor"],
  "/technician": ["superAdmin", "supervisor", "technician"],
  "/dashboard": ["superAdmin", "supervisor", "technician"],
} as Record<string, Role[]>;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route needs protection
  const protectedRoute = Object.keys(PROTECTED_ROUTES).find(route =>
    pathname.startsWith(route)
  );

  if (!protectedRoute) {
    return NextResponse.next();
  }

  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: request.headers
    });

    // If no session, redirect to login
    if (!session?.user) {
      const loginUrl = new URL('/auth/signin', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has required role
    const userRole = (session.user as any).role as Role;
    const requiredRoles = PROTECTED_ROUTES[protectedRoute];

    if (!userRole || !requiredRoles.includes(userRole)) {
      // Redirect to unauthorized page
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // User has access, continue
    return NextResponse.next();

  } catch (error) {
    console.error('Middleware error:', error);
    // On error, redirect to login
    const loginUrl = new URL('/auth/signin', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/supervisor/:path*',
    '/technician/:path*',
    '/dashboard/:path*'
  ]
};