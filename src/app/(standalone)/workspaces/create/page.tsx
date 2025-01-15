import { getCurrentUser } from "@/features/auth/queries";
import CreateWorkspaceForm from "@/features/workspaces/components/create-workspace-form";
import { redirect } from "next/navigation";

const CreatePage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="w-full">
      <CreateWorkspaceForm />
    </div>
  );
};

export default CreatePage;
