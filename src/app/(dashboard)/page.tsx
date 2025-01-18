import { getCurrentUser } from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";
export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user?.$id) redirect("/sign-in");

  const workspaces = await getWorkspaces();
  console.log("🚀 ~ Dashboard ~ workspaces:", workspaces)
  
  if (workspaces.total === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspaces.documents[0].$id}`);
  }
}
