import { getCurrentUser } from "@/features/auth/queries";
import EditWorkspaceForm from "@/features/workspaces/components/edit-workspace-form";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  
  return <EditWorkspaceForm />;
};

export default SettingsPage;
