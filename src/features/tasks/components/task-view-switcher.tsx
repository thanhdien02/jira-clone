"use client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { columns } from "@/features/tasks/components/task-colunms";
import TaskTable from "@/features/tasks/components/task-table";
import useCreateTaskModal from "@/features/tasks/hooks/use-create-task-modal";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import useGetTasks from "../api/use-get-tasks";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import useProjectId from "@/features/projects/hooks/use-project-id";
import { Loader } from "lucide-react";

const TaskViewSwitcher = () => {
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();
  const { data, isLoading } = useGetTasks({ workspaceId, projectId });
  const { open: openCreateTask } = useCreateTaskModal();
  if (isLoading)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader className="size-6 animate-spin text-neutral-500" />
      </div>
    );
  return (
    <Card className="p-5 shadow-none">
      <Tabs defaultValue="account" className="">
        <TabsList className="gap-x-4 bg-white">
          <TabsTrigger value="account" className="!shadow-none bg-white">
            Table
          </TabsTrigger>
          <TabsTrigger value="password" className="!shadow-none bg-white">
            Kanban
          </TabsTrigger>
          <TabsTrigger value="calender" className="!shadow-none bg-white">
            Calender
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="w-full">
          <TaskTable data={data?.documents || []} columns={columns} />
        </TabsContent>
        <TabsContent value="password">kanban</TabsContent>
        <TabsContent value="calender">Calender.</TabsContent>
      </Tabs>
      <DottedSeparator className="w-full my-5" />
      <Button
        type="button"
        className="flex ml-auto w-fit"
        onClick={openCreateTask}
      >
        Add new task
      </Button>
    </Card>
  );
};

export default TaskViewSwitcher;
