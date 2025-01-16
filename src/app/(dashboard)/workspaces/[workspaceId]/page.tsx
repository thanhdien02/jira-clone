import { getCurrentUser } from "@/features/auth/queries";
import { redirect } from "next/navigation";

const WorkspaceIdPage = async () => {
  const user = await getCurrentUser();
  if (!user?.$id) redirect("/sign-in");
  return <div className="p-6">Workspace ID:</div>;
};

export default WorkspaceIdPage;
