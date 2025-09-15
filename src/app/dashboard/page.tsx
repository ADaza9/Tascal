import { logoutAction } from "@/lib/auth-actions";
import { RoleGuard, SuperAdminOnly, SupervisorAndAbove } from "@/components/auth/role-guard";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navigation */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">TASCAL Dashboard</a>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content flex content-center justify-center">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <a className="justify-between">
                  Perfil
                  <span className="badge badge-secondary">{user?.role}</span>
                </a>
              </li>
              <li>
                <form action={logoutAction}>
                  <button type="submit" className="w-full text-left">
                    Cerrar Sesión
                  </button>
                </form>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
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

        {/* Stats */}
        <div className="stats stats-vertical lg:stats-horizontal shadow w-full mb-8">
          <div className="stat">
            <div className="stat-title">Nivel de Acceso</div>
            <div className="stat-value text-primary">{
              user.role === 'superAdmin' ? '3' :
              user.role === 'supervisor' ? '2' :
              user.role === 'technician' ? '1' : '0'
            }</div>
            <div className="stat-desc">de 3 niveles</div>
          </div>

          <div className="stat">
            <div className="stat-title">Sesión Activa</div>
            <div className="stat-value text-secondary">✓</div>
            <div className="stat-desc">Autenticado correctamente</div>
          </div>

          <div className="stat">
            <div className="stat-title">Email</div>
            <div className="stat-value text-sm">{user.email}</div>
            <div className="stat-desc">Verificado</div>
          </div>
        </div>

        {/* Role-based Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Available to all authenticated users */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-accent">📊 Reportes Básicos</h2>
              <p>Acceso a reportes y estadísticas básicas del sistema.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Ver Reportes</button>
              </div>
            </div>
          </div>

          {/* Supervisor and above */}
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
                <h2 className="card-title text-info">🔧 Herramientas Técnicas</h2>
                <p>Acceso a herramientas específicas para técnicos.</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-info">Abrir Herramientas</button>
                </div>
              </div>
            </div>
          </RoleGuard>

        </div>

        {/* User Info Debug */}
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
      </div>
    </div>
  );
}