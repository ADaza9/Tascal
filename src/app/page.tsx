import { getCurrentUser } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  // Check if user is already logged in
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="navbar bg-transparent">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-primary">TASCAL</h1>
          </div>
          <div className="flex-none">
            <Link href="/auth/signin" className="btn btn-primary">
              Iniciar Sesión
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="hero min-h-[80vh]">
          <div className="hero-content text-center">
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TASCAL
              </h1>
              <p className="text-xl md:text-2xl py-6 text-base-content/80">
                Sistema de gestión empresarial con control de roles avanzado
              </p>
              <p className="text-lg mb-8 text-base-content/60">
                Administra equipos, proyectos y recursos con diferentes niveles de acceso
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signin" className="btn btn-primary btn-lg">
                  Iniciar Sesión
                </Link>
                <Link href="/auth/signup" className="btn btn-outline btn-lg">
                  Crear Cuenta
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <div className="text-4xl mb-4">👥</div>
              <h2 className="card-title justify-center">Control de Roles</h2>
              <p>Sistema jerárquico con roles de Super Admin, Supervisor y Técnico</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h2 className="card-title justify-center">Seguridad Avanzada</h2>
              <p>Autenticación robusta con Better Auth y middleware de protección</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <div className="text-4xl mb-4">📱</div>
              <h2 className="card-title justify-center">Responsive</h2>
              <p>Diseño adaptativo con DaisyUI para cualquier dispositivo</p>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-center justify-center text-2xl mb-6">
              Prueba el Sistema
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-base-100 p-4 rounded-lg">
                <h3 className="font-bold text-error">Super Admin</h3>
                <p className="text-sm text-base-content/70">superadmin@example.com</p>
                <p className="text-sm text-base-content/70">SuperAdmin123!</p>
              </div>
              <div className="bg-base-100 p-4 rounded-lg">
                <h3 className="font-bold text-warning">Supervisor</h3>
                <p className="text-sm text-base-content/70">supervisor@example.com</p>
                <p className="text-sm text-base-content/70">Supervisor123!</p>
              </div>
              <div className="bg-base-100 p-4 rounded-lg">
                <h3 className="font-bold text-info">Técnico</h3>
                <p className="text-sm text-base-content/70">technician@example.com</p>
                <p className="text-sm text-base-content/70">Technical123!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
