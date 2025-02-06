import { getCurrentUser } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import MemberClient from "./client";

const MemberPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return <MemberClient userId={user.$id}/>;
};

export default MemberPage;
