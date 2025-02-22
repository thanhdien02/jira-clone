"use client";
import { Card } from "@/components/ui/card";
import useGetTask from "@/features/tasks/api/use-get-task";
import useTaskId from "@/features/tasks/hooks/use-task-id";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Loader } from "lucide-react";
import TaskDescription from "@/features/tasks/components/task-description";
import { Member } from "@/features/members/types";
import { Project } from "@/features/projects/types";
import { Task } from "@/features/tasks/types";
import TaskInformation from "@/features/tasks/components/task-infomation";

const TaskClient = () => {
  const taskId = useTaskId();
  const { data, isLoading } = useGetTask({ taskId });
  if (isLoading)
    return (
      <div className="py-80 flex items-center justify-center ">
        <Loader className="size-5 animate-spin text-neutral-500" />
      </div>
    );
  return (
    <main className="p-5 flex flex-col gap-y-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/workspaces/${data?.workspaceId}/projects/${data?.projectId}`}
              className="text-base text-black font-medium"
            >
              {data?.project.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm font-medium truncate max-w-[200px]">
              {data?.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="p-5 shadow-none">
        <div className="flex justify-between md:flex-row flex-col gap-4">
          <TaskInformation
            data={data as Task & { assignee: Member; project: Project }}
          />
          <TaskDescription
            data={data as Task & { assignee: Member; project: Project }}
          />
        </div>
      </Card>
    </main>
  );
};

export default TaskClient;
