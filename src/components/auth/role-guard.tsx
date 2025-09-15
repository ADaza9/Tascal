"use client";

import { ReactNode } from "react";
import { UserRole, hasPermission } from "@/lib/auth-utils";

interface RoleGuardProps {
  children: ReactNode;
  requiredRole: UserRole;
  userRole?: UserRole | null;
  fallback?: ReactNode;
  exact?: boolean; // If true, requires exact role match
}

/**
 * Client-side component to conditionally render content based on user role
 */
export function RoleGuard({
  children,
  requiredRole,
  userRole,
  fallback = null,
  exact = false
}: RoleGuardProps) {
  if (!userRole) {
    return <>{fallback}</>;
  }

  const hasAccess = exact
    ? userRole === requiredRole
    : hasPermission(userRole, requiredRole);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

interface PermissionGuardProps {
  children: ReactNode;
  permission: string;
  userRole?: UserRole | null;
  fallback?: ReactNode;
}

/**
 * Client-side component to conditionally render content based on specific permissions
 */
export function PermissionGuard({
  children,
  permission,
  userRole,
  fallback = null
}: PermissionGuardProps) {
  if (!userRole) {
    return <>{fallback}</>;
  }

  const hasAccess = hasPermission(userRole, permission as any);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

/**
 * Show content only to super admins
 */
export function SuperAdminOnly({ children, userRole, fallback = null }: {
  children: ReactNode;
  userRole?: UserRole | null;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard
      requiredRole="superAdmin"
      userRole={userRole}
      fallback={fallback}
      exact
    >
      {children}
    </RoleGuard>
  );
}

/**
 * Show content only to supervisors and above
 */
export function SupervisorAndAbove({ children, userRole, fallback = null }: {
  children: ReactNode;
  userRole?: UserRole | null;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard
      requiredRole="supervisor"
      userRole={userRole}
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}