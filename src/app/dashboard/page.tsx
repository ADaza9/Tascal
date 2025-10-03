import { RoleGuard, SuperAdminOnly, SupervisorAndAbove } from "@/components/auth/role-guard";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="hero bg-base-100 rounded-lg shadow-lg mb-8">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-3xl font-bold">¡Bienvenido, {user.name}!</h1>
              <p className="py-4">
                Tu rol: <span className="badge badge-primary badge-lg">{user.role}</span>
              </p>
              {user.roleDescription && (
                <p className="text-base-content/70">
                  {user.roleDescription}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <SupervisorAndAbove userRole={user.role as any}>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-warning">👥 Gestión de Equipos</h2>
                <p>Administra equipos de trabajo y asigna tareas.</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-warning">Gestionar</button>
                </div>
              </div>
            </div>
          </SupervisorAndAbove>

          {/* Super Admin only */}
          <SuperAdminOnly userRole={user.role as any}>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-error">⚙️ Administración</h2>
                <p>Panel de administración completo del sistema.</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-error">Admin Panel</button>
                </div>
              </div>
            </div>
          </SuperAdminOnly>

          {/* Technician specific */}
          <RoleGuard requiredRole="technician" userRole={user.role  as any} exact>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-info">🔧 Registro de Actividades</h2>
                <p>Registro de actividades de control.</p>
                <div className="card-actions justify-end">
                   <Link href={'/dashboard/register'}>
                  <button className="btn btn-info">Registrar</button>
                  </Link>
                </div>
              </div>
            </div>
          </RoleGuard>

  
          <RoleGuard requiredRole="technician" userRole={user.role  as any} exact>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-info">🔧 Ver listad de Actividades</h2>
                <p>lista de actividades de control.</p>
                <div className="card-actions justify-end">
                   <Link href={'/dashboard/list'}>
                  <button className="btn btn-info">Ver Listado</button>
                  </Link>
                </div>
              </div>
            </div>
          </RoleGuard>

          <RoleGuard requiredRole="technician" userRole={user.role  as any} exact>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-info">🔧 Ver lista de camionetas</h2>
                <p>lista de camionetas.</p>
                <div className="card-actions justify-end">
                   <Link href={'/dashboard/trucks'}>
                  <button className="btn btn-info">Ver Listado</button>
                  </Link>
                </div>
              </div>
            </div>
          </RoleGuard>
        </div>

        {/* User Info Debug */}
        {
          isDevelopment && <>
          <div className="mt-8">
          <details className="collapse collapse-arrow bg-base-100">
            <summary className="collapse-title text-xl font-medium">
              Información de Usuario (Debug)
            </summary>
            <div className="collapse-content">
              <pre className="bg-base-200 p-4 rounded-lg text-sm overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </details>
        </div>
        </>
        }
      </div>
    </div>
  );
}