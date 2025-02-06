import { redirect } from "next/navigation";
import ProjectIdClient from "./client";
import { getCurrentUser } from "@/features/auth/queries";

const ProjectIdPage = async () => {
  const user = await getCurrentUser();
  if (!user?.$id) redirect("/sign-in");
  return <ProjectIdClient/>;
};

export default ProjectIdPage;
