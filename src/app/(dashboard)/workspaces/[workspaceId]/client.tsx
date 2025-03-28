"use client";

import StatisticCount from "@/components/statistics-count";
import { Button } from "@/components/ui/button";
import useGetMembers from "@/features/members/api/use-get-members";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Member } from "@/features/members/types";
import useGetProjects from "@/features/projects/api/use-get-projects";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import useCreateProjectModal from "@/features/projects/hooks/use-create-project-modal";
import { Project } from "@/features/projects/types";
import useGetTasks from "@/features/tasks/api/use-get-tasks";
import { TaskDate } from "@/features/tasks/components/task-date";
import useCreateTaskModal from "@/features/tasks/hooks/use-create-task-modal";
import { Task } from "@/features/tasks/types";
import useGetWorkspaceStatistics from "@/features/workspaces/api/use-get-workspace-statistics";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import { Loader, PlusIcon, TriangleAlert } from "lucide-react";
import { IoMdSettings } from "react-icons/io";
import { useRouter } from "next/navigation";

const DashboardWorkspaceClient = () => {
  const workspaceId = useWorkspaceId();

  const { data: dataTaskList, isLoading: isTaskLoading } = useGetTasks({
    workspaceId,
  });
  const { data, isLoading: isStatisticLoading } = useGetWorkspaceStatistics({
    workspaceId,
  });
  const { data: dataProjectList, isLoading: isProjectLoading } = useGetProjects(
    { workspaceId }
  );
  const { data: dataMemberList, isLoading: isMemberLoading } = useGetMembers({
    workspaceId,
  });

  if (
    isMemberLoading ||
    isProjectLoading ||
    isStatisticLoading ||
    isTaskLoading
  ) {
    return (
      <div className="py-80 flex items-center justify-center">
        <Loader className="size-5 text-neutral-500 animate-spin" />
      </div>
    );
  }
  if (!data || !dataTaskList || !dataProjectList || !dataMemberList) {
    return (
      <div className="h-[calc(100vh-73px)] flex flex-col items-center justify-center gap-y-3">
        <TriangleAlert className="size-6 text-neutral-500" />
        <p className="text-base font-medium text-neutral-500">No data found.</p>
      </div>
    );
  }
  return (
    <div className="p-5">
      <StatisticCount data={data} />

      <div className="grid xl:grid-cols-2 grid-cols-1 gap-5 mt-5">
        <TaskList data={dataTaskList.documents} />
        <ProjectList data={dataProjectList.documents} />
      </div>
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-5 mt-5">
        <MemberList data={dataMemberList.documents} />
      </div>
    </div>
  );
};

interface TaskListProps {
  data: Task[];
}
const TaskList = ({ data }: TaskListProps) => {
  const { open } = useCreateTaskModal();
  const router = useRouter();
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-medium text-gray-900">Task List</h2>
        <Button
          className="text-sm"
          variant="muted"
          size={"icon"}
          onClick={() => {
            open();
          }}
        >
          <PlusIcon className="size-5 text-neutral-500" />
        </Button>
      </div>
      <div
        className="p-5 flex flex-col gap-y-2 items-center
       bg-gray-100 rounded-lg max-h-[400px] overflow-y-auto hide-scrollbar"
      >
        {data.map((task) => (
          <div
            key={task.$id}
            onClick={() => {
              router.push(`/workspaces/${task.workspaceId}/tasks/${task.$id}`);
            }}
            className="flex items-center justify-between 
          gap-x-4 py-2 px-4 border border-gray-200 rounded-md w-full bg-white"
          >
            <p className="line-clamp-1">{task.name}</p>
            <p className="bg-gray-200 rounded-full size-1 shrink-0"></p>
            <TaskDate value={task.dueDate} className="text-sm" />
          </div>
        ))}
      </div>
      <Button
        className="w-full mt-3 border-none bg-gray-100"
        variant={"secondary"}
        type="button"
        onClick={() => {
          router.push(
            `/workspaces/${data?.[0].workspaceId}/projects/${data?.[0].projectId}`
          );
        }}
      >
        See All
      </Button>
    </div>
  );
};

interface ProjectListProps {
  data: Project[];
}

const ProjectList = ({ data }: ProjectListProps) => {
  const { open } = useCreateProjectModal();
  const router = useRouter();
  return (
    <div className="p-5 border border-gray-100 rounded-lg h-fit">
      <div className="mb-5 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Project List</h2>
        <Button
          className="text-sm"
          variant="muted"
          size={"icon"}
          onClick={() => {
            open();
          }}
        >
          <PlusIcon className="size-5 text-neutral-500" />
        </Button>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {data.map((project) => (
          <div
            key={project.$id}
            onClick={() => {
              router.push(
                `/workspaces/${project.workspaceId}/projects/${project.$id}`
              );
            }}
            className="cursor-pointer flex items-center gap-x-2 
            bg-white px-3 py-2 rounded-md shadow-md w-full h-fit"
          >
            <ProjectAvatar name={project.name} image={project.imageUrl} />
            <p className="text-base font-medium text-gray-900 line-clamp-1">
              {project.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

interface MemberListProps {
  data: Member[];
}
const MemberList = ({ data }: MemberListProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  return (
    <div className="p-5 border border-gray-100 rounded-lg h-fit max-h-[250px] overflow-y-auto hide-scrollbar">
      <div className="mb-5 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Members</h2>
        <Button
          className="text-sm"
          variant="muted"
          size={"icon"}
          onClick={() => {
            router.push(`/workspaces/${workspaceId}/members`);
          }}
        >
          <IoMdSettings className="size-5 text-neutral-500" />
        </Button>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {data.map((member) => (
          <div
            key={member.$id}
            className="cursor-pointer flex items-center gap-x-2 
            bg-white px-3 py-2 rounded-md shadow-md w-full h-fit"
          >
            <MemberAvatar name={member.name} />
            <p className="text-base font-medium text-gray-900 line-clamp-1">
              {member.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardWorkspaceClient;
