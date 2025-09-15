"use server";

import { auth } from "@/utils/auth";
import { cookies, headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { z } from "zod";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Debe ser un email válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export interface ActionState {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function loginAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // Validate input
    const validatedData = loginSchema.parse(rawData);

    // Attempt login
    const result = await auth.api.signInEmail({
      body: validatedData,
      headers: await headers(), // ✅ Esto establece las cookies
    });
    console.log("Login result:", result);

    if (result?.user) {
      const cookieStore = await cookies();
      cookieStore.set("better-auth.session_token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 días
        path: "/",
      });

      // Redirect to dashboard on successful login
      redirect("/dashboard", RedirectType.replace);
    }

    return { error: "Error inesperado durante el login" };
  } catch (error: any) {
    // Don't log NEXT_REDIRECT errors as they are expected
    if (error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("Login error:", error);

    // Handle validation errors
    if (error.name === "ZodError") {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err: any) => {
        if (err.path) {
          fieldErrors[err.path[0]] = [err.message];
        }
      });
      return { fieldErrors };
    }

    // Handle auth errors
    if (error.message?.includes("Invalid email or password")) {
      return { error: "Email o contraseña incorrectos" };
    }

    if (error.message?.includes("Too many requests")) {
      return { error: "Demasiados intentos. Intenta más tarde" };
    }

    return { error: "Error durante el login. Intenta nuevamente" };
  }
}

export async function logoutAction() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    redirect("/auth/signin");
  } catch (error) {
    console.error("Logout error:", error);
    redirect("/auth/signin");
  }
}
