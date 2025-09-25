import StepperForm from "@/components/activities/activity-form";
import { HeaderActivity } from "@/components/header/header-activity";
import { getCurrentUser } from "@/lib/session";

import { redirect } from "next/navigation";


export default async function registerActivity() {
  // Function logic here
    const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const isDevelopment = process.env.NODE_ENV === "development";
 
  return (
    <div className="min-h-screen px-4 py-8">
            <HeaderActivity link="/dashboard" title="Registrar de Actividades" />

    <StepperForm user={user} isDevelopment={isDevelopment} />
    </div>
  );
}