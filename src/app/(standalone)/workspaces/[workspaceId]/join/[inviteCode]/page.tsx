import { getCurrentUser } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import JoinWorkspaceClient from "./client";

const JoinPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  return <JoinWorkspaceClient />;
};

export default JoinPage;
