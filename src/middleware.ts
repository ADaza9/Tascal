import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { session, user, roles } from "@/db/auth-schema";
import { eq, and, gt } from "drizzle-orm";

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
    // Get session token from cookie
    const sessionToken = request.cookies.get('better-auth.session_token')?.value;
    console.log('Cookie token:', sessionToken);

    if (!sessionToken) {
      console.log('No session token found');
      const loginUrl = new URL('/auth/signin', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify session directly in database
    const currentTime = new Date();
    const sessionData = await db
      .select({
        sessionId: session.id,
        sessionToken: session.token,
        sessionExpiresAt: session.expiresAt,
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        userRoleId: user.roleId,
        roleName: roles.name,
      })
      .from(session)
      .innerJoin(user, eq(session.userId, user.id))
      .leftJoin(roles, eq(user.roleId, roles.id))
      .where(
        and(
          eq(session.token, sessionToken),
          gt(session.expiresAt, currentTime) // Session not expired
        )
      )
      .limit(1);

    // If no valid session found
    if (!sessionData.length) {
      console.log('No valid session in database');
      const loginUrl = new URL('/auth/signin', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const userData = sessionData[0];
    const userRole = userData.roleName as Role;
    const requiredRoles = PROTECTED_ROUTES[protectedRoute];

    // Check if user has required role
    if (!userRole || !requiredRoles.includes(userRole)) {
      console.log('User does not have required role');
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    console.log('Access granted for user:', userData.userEmail);
    return NextResponse.next();

  } catch (error) {
    console.error('Middleware error:', error);
    const loginUrl = new URL('/auth/signin', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  runtime: "nodejs",
  matcher: [
    '/admin/:path*',
    '/supervisor/:path*',
    '/technician/:path*',
    '/dashboard/:path*'
  ]
};