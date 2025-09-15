import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";;
import { user, account, session, verification } from "@/db/auth-schema";


// Luego, tu configuración de auth puede quedarse igual:
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "pg" or "mysql",
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
});
