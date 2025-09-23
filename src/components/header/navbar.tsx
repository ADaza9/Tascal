import { getCurrentUser } from "@/lib/session";
import { logoutAction } from "@/lib/auth-actions";

export default async function navbar() {
  const user = await getCurrentUser();

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">TASCAL Dashboard</a>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full bg-primary text-primary-content flex content-center justify-center">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
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
  );
}
