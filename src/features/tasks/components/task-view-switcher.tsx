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
import TaskFilter from "./task-filter";
import useTaskFilters from "../hooks/use-task-filters";

const TaskViewSwitcher = () => {
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();
  const [{ status, assigneeId, dueDate, search }] = useTaskFilters();
  const { data, isLoading } = useGetTasks({
    workspaceId,
    projectId,
    status,
    dueDate,
    assigneeId,
    search,
  });
  const { open: openCreateTask } = useCreateTaskModal();
  if (isLoading)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader className="size-6 animate-spin text-neutral-500" />
      </div>
    );

  return (
    <Card className="p-5 shadow-none">
      <Tabs defaultValue="table" className="">
        <TabsList className="gap-x-4 bg-white">
          <TabsTrigger value="table" className="!shadow-none bg-white">
            Table
          </TabsTrigger>
          <TabsTrigger value="kanban" className="!shadow-none bg-white">
            Kanban
          </TabsTrigger>
          <TabsTrigger value="calender" className="!shadow-none bg-white">
            Calender
          </TabsTrigger>
        </TabsList>
        <DottedSeparator className="w-full my-5" />
        <div className="flex justify-between items-center">
          <TaskFilter />
          <Button
            type="button"
            className="flex ml-auto w-fit mt-5"
            onClick={openCreateTask}
          >
            Add new task
          </Button>
        </div>
        <DottedSeparator className="w-full my-5" />
        <TabsContent value="table" className="w-full">
          <TaskTable data={data?.documents || []} columns={columns} />
        </TabsContent>
        <TabsContent value="kanban">kanban</TabsContent>
        <TabsContent value="calender">Calender.</TabsContent>
      </Tabs>
    </Card>
  );
};

export default TaskViewSwitcher;
