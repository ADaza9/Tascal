import { HeaderActivity } from "@/components/header/header-activity";
import { db } from "@/db";
import { roles, user as userShema } from "@/db/auth-schema";
import { getCurrentUser } from "@/lib/session";
import { eq } from "drizzle-orm";
import Link from "next/link";

import { redirect } from "next/navigation";


export default async function usersList() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const data = await db
    .select()
    .from(userShema)
    .innerJoin(roles, eq(userShema.roleId, roles.id)).then( res => {
      return res.filter( r => r.roles.name !== 'superAdmin');
    });
  
  return (
    <div className="min-h-screen px-4 py-8">
        <section className="flex justify-between items-center">
          <HeaderActivity link="/dashboard" title="Gestion de usuarios" />
           <Link href={"./users/create"} className="btn btn-accent">crear usuario</Link>
        </section>

      <section className="mt-6 mx-4">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Creado en</th>
              </tr>
            </thead>
            <tbody>
              {data.map((u) => (
                <tr key={u.user.id}>
                  <td>{u.user.name}</td>
                  <td>{u.user.email}</td>
                  <td>{u.roles?.name}</td>
                  <td>{new Date(u.user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
