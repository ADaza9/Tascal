import RegisterTruckForm from "@/components/trucks/RegisterTruckForm";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
export default async function() {
      const user = await getCurrentUser();

   if (!user) {
      redirect("/auth/signin");
    }
  
    return <RegisterTruckForm userId={user?.id} />
}