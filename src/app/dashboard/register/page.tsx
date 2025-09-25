import StepperForm from "@/components/activities/activity-form";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";


export default async function registerActivity() {
  // Function logic here
    const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }
 
  return (
    <div>
      <h1>Register Activity Page</h1>

    <StepperForm user={user} />
    </div>
  );
}