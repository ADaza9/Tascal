import ActivityOperationTable from "@/components/activities/activity-list";
import { HeaderActivity } from "@/components/header/header-activity";
import { db } from "@/db";
import { activityOperation } from "@/db/auth-schema";
import { getCurrentUser } from "@/lib/session";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function registerActivity() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const activities = await db
    .select()
    .from(activityOperation)
    .where(eq(activityOperation.userId, user.id));
  return (
    <div className="min-h-screen px-4 py-8">
       <HeaderActivity link="/dashboard" title="Historial de Actividades" />
      <section className="mt-6 mx-4">
        <ActivityOperationTable data={activities} />
      </section>
    </div>
  );
}
