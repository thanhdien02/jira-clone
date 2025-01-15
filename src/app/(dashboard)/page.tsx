import { getCurrentUser } from "@/features/auth/queries";
import { redirect } from "next/navigation";
export default async function Home() {
  
  const user = await getCurrentUser();
  if (!user?.$id) redirect("/sign-in");
  

  return <div className="p-5">Home page</div>;
}
