import { HeaderActivity } from "@/components/header/header-activity";
import TrucksTableClient from "@/components/trucks/TrucksTableClient";
import { db } from "@/db";
import { trucks } from "@/db/auth-schema";
import { getCurrentUser } from "@/lib/session";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { use, useMemo } from "react";

export default async function ListTrucks() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const trucksList = await db
    .select()
    .from(trucks)
    .where(eq(trucks.userId, user.id));

  return (
    <div className="min-h-screen px-4 py-8">
      <HeaderActivity link="/dashboard" title="Historial de Camionetas" />
      <Link
        className="btn btn-primary text-white"
        href="/dashboard/trucks/register"
      >
        Crear registros
      </Link>
      <section className="mt-6 mx-4">
        {trucksList.length > 0 ? (
          <TrucksTableClient data={trucksList} />
        ) : (
          <section className="h-full flex flex-col gap-5 justify-center items-center pt-5">
            <p className="text-xl">No tienes registros de camionetas</p>
            <Link
              className="btn btn-accent text-white"
              href="/dashboard/trucks/register"
            >
              Crear registros de camioneta
            </Link>
          </section>
        )}
      </section>
    </div>
  );
}
