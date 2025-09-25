import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/auth-utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  // Redirect if already logged in
  const user = await getCurrentUser(await headers());
  if (user) {
    redirect("/dashboard");
  }

  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-base-200 to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-screen">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TASCAL
            </h1>
            <p className="text-base-content/70 mt-2">
              Sistema de gestión empresarial
            </p>
          </div>

          {/* Login Form */}
          <LoginForm  isDev={isDevelopment} />
        </div>
      </div>
    </div>
  );
}