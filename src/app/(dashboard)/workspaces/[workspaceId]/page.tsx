import { getCurrentUser } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import DashboardWorkspaceClient from "./client";

const WorkspaceIdPage = async () => {
  const user = await getCurrentUser();
  if (!user?.$id) redirect("/sign-in");
  return <DashboardWorkspaceClient />;
};

export default WorkspaceIdPage;
