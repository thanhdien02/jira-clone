"use client";
import { AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import useGetProject from "@/features/projects/api/use-get-project";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import useEditProjectModal from "@/features/projects/hooks/use-edit-project-modal";
import useProjectId from "@/features/projects/hooks/use-project-id";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";

import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import { Avatar } from "@radix-ui/react-avatar";
import { Loader } from "lucide-react";
import { MdOutlineEdit } from "react-icons/md";

const ProjectIdClient = () => {
  const { open: openEditProject } = useEditProjectModal();

  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();
  const { data: project, isLoading } = useGetProject({
    projectId,
    workspaceId,
  });

  return (
    <main className="p-5 flex flex-col gap-y-5">
      <div className="flex justify-between items-center">
        {isLoading ? (
          <div className="size-10"></div>
        ) : (
          <>
            <div className="flex items-center gap-x-3">
              {isLoading ? (
                <div className="size-10 rounded-md flex items-center justify-center bg-neutral-100">
                  <Loader className="size-4 animate-spin" />
                </div>
              ) : project?.imageUrl ? (
                <ProjectAvatar
                  name="Project Avatar"
                  className="size-10"
                  src={project?.imageUrl as string}
                />
              ) : (
                <Avatar className="size-10 rounded-md bg-blue-500">
                  <AvatarFallback className="bg-blue-500 text-white text-lg font-medium">
                    {project?.name?.trim().charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <h1 className="text-lg font-medium">{project?.name}</h1>
            </div>
            <Button
              size={"sm"}
              variant={"outline"}
              className="shadow-none"
              disabled={isLoading}
              onClick={openEditProject}
            >
              <MdOutlineEdit className="mr-2" size={"16"} />
              Edit project
            </Button>
          </>
        )}
      </div>

      <TaskViewSwitcher />
    </main>
  );
};

export default ProjectIdClient;
