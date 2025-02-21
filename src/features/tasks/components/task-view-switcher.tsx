"use client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { columns } from "@/features/tasks/components/table-colunms";
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
import TaskKanban from "./task-kanban";
import { useQueryState } from "nuqs";
import useUpdateBulkTasks from "../api/use-update-bulk-tasks";
import { TaskStatus } from "../types";
import TaskCalender from "./task-calendar";

const TaskViewSwitcher = () => {
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();
  const { mutate } = useUpdateBulkTasks();
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });
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
  const onBulkUpdate = (
    tasks: { $id: string; status: TaskStatus; position: number }[]
  ) => {
    mutate({ json: tasks });
  };

  return (
    <Card className="p-5 shadow-none">
      <Tabs defaultValue={view} onValueChange={setView}>
        <TabsList className="gap-4 bg-white h-full w-full md:w-auto">
          <TabsTrigger
            value="table"
            className="!shadow-none bg-gray-100 flex-1"
          >
            Table
          </TabsTrigger>
          <TabsTrigger
            value="kanban"
            className="!shadow-none bg-gray-100 flex-1"
          >
            Kanban
          </TabsTrigger>
          <TabsTrigger
            value="calender"
            className="!shadow-none bg-gray-100 flex-1"
          >
            Calender
          </TabsTrigger>
        </TabsList>
        <DottedSeparator className="w-full my-5" />
        <div className="flex md:flex-row flex-col justify-between items-center gap-4">
          <TaskFilter />
          <Button
            type="button"
            className="md:w-fit w-full"
            size={"sm"}
            onClick={openCreateTask}
          >
            Add new task
          </Button>
        </div>
        <DottedSeparator className="w-full my-5" />
        {isLoading ? (
          <div className="py-20 w-full flex justify-center items-center">
            <Loader className="size-6 animate-spin text-neutral-500 " />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="w-full">
              <TaskTable data={data?.documents || []} columns={columns} />
            </TabsContent>
            <TabsContent value="kanban">
              <TaskKanban
                data={data?.documents || []}
                onChange={onBulkUpdate}
              />
            </TabsContent>
            <TabsContent value="calender">
              <TaskCalender data={data?.documents || []} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </Card>
  );
};

export default TaskViewSwitcher;
