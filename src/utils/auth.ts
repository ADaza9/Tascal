import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { db } from "@/db";;
import { user, account, session, verification, roles } from "@/db/auth-schema";
import { eq } from "drizzle-orm";


export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: false,
    schema: { user, account, session, verification }
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24 * 7, // 7 days
  },
  advanced: {
    cookiePrefix: "better-auth", 
    useSecureCookies: process.env.NODE_ENV === 'production',
    cookies: {
      session_token: {
        name: "session_token",
        attributes: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 30, // 30 días
        }
      },
    }
  },
  plugins: [
    customSession(async ({ user: authUser, session }) => {
      if (!authUser?.id) {
        return { user: authUser, session };
      }

      // Fetch user with role information
      const userWithRole = await db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
          roleId: user.roleId,
          roleName: roles.name,
          roleDescription: roles.description,
        })
        .from(user)
        .leftJoin(roles, eq(user.roleId, roles.id))
        .where(eq(user.id, authUser.id))
        .limit(1);

      const userData = userWithRole[0];

      return {
        user: {
          ...authUser,
          role: userData?.roleName || null,
          roleId: userData?.roleId || null,
          roleDescription: userData?.roleDescription || null,
        },
        session,
      };
    }),
  ],
});
