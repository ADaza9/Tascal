import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";;


// Luego, tu configuración de auth puede quedarse igual:
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "pg" or "mysql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24 * 7, // 7 days
  },
});
