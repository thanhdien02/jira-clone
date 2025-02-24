import { getCurrentUser } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import ProjectSettingsClient from "./client";

const ProjectSettings = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return <ProjectSettingsClient />;
};

export default ProjectSettings;
