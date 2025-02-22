import { getCurrentUser } from "@/features/auth/queries";
import { redirect } from "next/navigation";

const TaskPage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return <div>Task page</div>;
};

export default TaskPage;
