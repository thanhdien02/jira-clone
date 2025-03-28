"use client";
import UserButton from "@/features/auth/components/user-button";
import MobileSidebar from "./mobile-sidebar";
import useProjectId from "@/features/projects/hooks/use-project-id";
import useTaskId from "@/features/tasks/hooks/use-task-id";

export function Navbar() {
  const projectId = useProjectId();
  const taskId = useTaskId();
  const title = projectId ? "Project" : taskId ? "Task" : "Home";
  const description = projectId
    ? "Information of projects"
    : taskId
    ? "Information of tasks"
    : "Information all of page";
  return (
    <div className="h-[76px] flex justify-between items-center px-5">
      <div className="hidden lg:flex flex-col">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-base text-neutral-500">{description}</p>
      </div>
      <MobileSidebar />
      <UserButton />
    </div>
  );
}
