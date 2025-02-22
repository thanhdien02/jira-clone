import { getCurrentUser } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import TaskClient from "./client";

const WorkspaceIdPage = async () => {
  const user = await getCurrentUser();
  if (!user?.$id) redirect("/sign-in");
  
  return <TaskClient />;
};

export default WorkspaceIdPage;
