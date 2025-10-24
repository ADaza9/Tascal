"use server";

import { db } from "@/db";
import { roles, user, account } from "@/db/auth-schema";
import { auth } from "@/utils/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function CreateUserPage() {
  async function createUser(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      throw new Error("Todos los campos son requeridos");
    }

    // Buscar el rol de técnico
    const [techRole] = await db
      .select()
      .from(roles)
      .where(eq(roles.name, "technician"))
      .limit(1);

    if (!techRole) {
      throw new Error("Rol de técnico no encontrado");
    }

    // Crear usuario

    await auth.api.signUpEmail({
      body: {
        email: email,
        password: password,
        name: name,
      },
    });

    // Crear cuenta con contraseña
    await db
      .update(user)
      .set({ roleId: techRole.id })
      .where(eq(user.email, email));

    revalidatePath("/dashboard/supervisor/users");
    redirect("/dashboard/supervisor/users");
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6">Crear Usuario Técnico</h1>
      <form action={createUser} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-500 mb-1"
          >
            Nombre Completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-500 mb-1"
          >
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-500 mb-1"
          >
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Crear Usuario
        </button>
      </form>
    </div>
  );
}
