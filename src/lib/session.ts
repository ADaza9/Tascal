import { db } from "@/db";
import { session, user, roles } from "@/db/auth-schema";
import { eq, and, gt } from "drizzle-orm";
import { cookies } from "next/headers";

export interface UserWithRole {
  id: string;
  email: string;
  name: string | null;
  roleId: string | null;
  role: string | null;
  roleDescription: string | null;
}

export async function getCurrentUser(): Promise<UserWithRole | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('better-auth.session_token')?.value;

    if (!sessionToken) {
      return null;
    }

    const currentTime = new Date();
    const sessionData = await db
      .select({
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        userRoleId: user.roleId,
        roleName: roles.name,
        roleDescription: roles.description,
      })
      .from(session)
      .innerJoin(user, eq(session.userId, user.id))
      .leftJoin(roles, eq(user.roleId, roles.id))
      .where(
        and(
          eq(session.token, sessionToken),
          gt(session.expiresAt, currentTime)
        )
      )
      .limit(1);

    if (!sessionData.length) {
      return null;
    }

    const userData = sessionData[0];

    return {
      id: userData.userId,
      email: userData.userEmail,
      name: userData.userName,
      roleId: userData.userRoleId,
      role: userData.roleName,
      roleDescription: userData.roleDescription,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function requireAuth(): Promise<UserWithRole> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  return user;
}

export async function getSessionFromToken(sessionToken: string): Promise<UserWithRole | null> {
  try {
    const currentTime = new Date();
    const sessionData = await db
      .select({
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        userRoleId: user.roleId,
        roleName: roles.name,
        roleDescription: roles.description,
      })
      .from(session)
      .innerJoin(user, eq(session.userId, user.id))
      .leftJoin(roles, eq(user.roleId, roles.id))
      .where(
        and(
          eq(session.token, sessionToken),
          gt(session.expiresAt, currentTime)
        )
      )
      .limit(1);

    if (!sessionData.length) {
      return null;
    }

    const userData = sessionData[0];

    return {
      id: userData.userId,
      email: userData.userEmail,
      name: userData.userName,
      roleId: userData.userRoleId,
      role: userData.roleName,
      roleDescription: userData.roleDescription,
    };
  } catch (error) {
    console.error('Error getting session from token:', error);
    return null;
  }
}