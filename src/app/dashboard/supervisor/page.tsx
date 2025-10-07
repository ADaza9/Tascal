import { IActivityOperation } from "@/app/models/activity.type";
import ActivityOperationTable from "@/components/activities/activity-list";
import { ActivityWrapper } from "@/components/activities/activity-wrapper";
import { HeaderActivity } from "@/components/header/header-activity";
import { db } from "@/db";
import { activityOperation } from "@/db/auth-schema";
import { getCurrentUser } from "@/lib/session";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { use, useMemo } from "react";

export default async function supervisorList() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const activities = await db
    .select()
    .from(activityOperation)
  
  return (
    <div className="min-h-screen px-4 py-8">
       <HeaderActivity link="/dashboard" title="Historial de Actividades" />
      <section className="mt-6 mx-4">

       <ActivityWrapper data={activities as unknown as IActivityOperation[]} />
        
      </section>
    </div>
  );
}
