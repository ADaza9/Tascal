"use server";

import { auth } from "@/utils/auth";
import { redirect, RedirectType } from "next/navigation";
import { z } from "zod";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Debe ser un email válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const signupSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Debe ser un email válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
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
    });

    if (result?.user) {
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

export async function signupAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    // Validate input
    const validatedData = signupSchema.parse(rawData);

    // Attempt signup
    const result = await auth.api.signUpEmail({
      body: {
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
      },
    });

    if (result?.user) {
      return { success: "Cuenta creada exitosamente. Puedes iniciar sesión ahora." };
    }

    return { error: "Error inesperado durante el registro" };
  } catch (error: any) {
    console.error("Signup error:", error);

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
    if (error.message?.includes("already exists")) {
      return { error: "Ya existe una cuenta con este email" };
    }

    return { error: "Error durante el registro. Intenta nuevamente" };
  }
}

export async function logoutAction() {
  try {
    await auth.api.signOut({
      headers: new Headers()
    });
    redirect("/auth/signin");
  } catch (error) {
    console.error("Logout error:", error);
    redirect("/auth/signin");
  }
}