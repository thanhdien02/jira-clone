"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

import ProjectAvatar from "@/features/projects/components/project-avatar";
import useGetProjects from "@/features/projects/api/use-get-projects";
import useCreateProjectModal from "@/features/projects/hooks/use-create-project-modal";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";

const ProjectList = () => {
  const { open } = useCreateProjectModal();
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const { data: projects } = useGetProjects({ workspaceId });

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="font-medium text-neutral-500 text-xs">PROJECTS</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 rounded-full cursor-pointer"
        />
      </div>
    
      <div className="flex flex-col gap-y-1">
        {projects?.documents?.map((project) => {
          const href: string = `/workspaces/${workspaceId}/projects/${project.$id}`;
          const isActive = pathname === href;
          return (
            <Link
              href={href}
              key={project.$id}
              className={`flex justify-start items-center gap-x-3 cursor-pointer hover:bg-white transition rounded-md px-2 py-3 ${
                isActive
                  ? "bg-white shadow-sm hover:opacity-100 text-primary"
                  : "text-neutral-500"
              }`}
            >
              <ProjectAvatar image={project?.imageUrl} name={project.name} />
              <p className="truncate text-inherit">{project?.name}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectList;
