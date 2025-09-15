import { headers } from 'next/headers';
import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";

export type UserRole = "superAdmin" | "supervisor" | "technician";

export const ROLE_PERMISSIONS = {
  superAdmin: {
    level: 3,
    description: "Full system access",
    permissions: ["read", "write", "delete", "admin", "manage_users"]
  },
  supervisor: {
    level: 2,
    description: "Management access",
    permissions: ["read", "write", "manage_tasks"]
  },
  technician: {
    level: 1,
    description: "Basic operational access",
    permissions: ["read", "write_own"]
  }
} as const;

/**
 * Check if user has required role or higher
 */
export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const userLevel = ROLE_PERMISSIONS[userRole]?.level || 0;
  const requiredLevel = ROLE_PERMISSIONS[requiredRole]?.level || 0;
  return userLevel >= requiredLevel;
}

/**
 * Check if user has specific permission
 */
export function hasSpecificPermission(userRole: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[userRole]?.permissions.includes(permission as any) || false;
}

/**
 * Server-side function to get session and verify role
 */
export async function requireAuth({ requiredRole, headers }: { requiredRole?: UserRole, headers?: Headers } = {}) {
  const session = await auth.api.getSession({
    headers: headers! // Proper Headers object for server-side calls
  });

  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (requiredRole && !hasPermission((session.user as any).role as UserRole, requiredRole)) {
    redirect('/unauthorized');
  }

  return session;
}

/**
 * Server-side function to get current user with role
 */
export async function getCurrentUser(headers: Headers) {
  const session = await auth.api.getSession({
    headers // Proper Headers object for server-side calls
  });
  return session?.user || null;
}

/**
 * Role-based access control decorator for API routes
 */
export function withRoleAuth(requiredRole: UserRole) {
  return function (handler: Function) {
    return async function (request: Request) {
      try {
        const session = await auth.api.getSession({
          headers: request.headers
        });

        if (!session?.user) {
          return new Response('Unauthorized', { status: 401 });
        }

        const userRole = (session.user as any).role as UserRole;
        if (!hasPermission(userRole, requiredRole)) {
          return new Response('Forbidden', { status: 403 });
        }

        return handler(request, { user: session.user, session });
      } catch (error) {
        console.error('Auth error:', error);
        return new Response('Internal Server Error', { status: 500 });
      }
    };
  };
}