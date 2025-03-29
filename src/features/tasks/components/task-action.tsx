"use client";
import React from "react";
import { useRouter } from "next/navigation";
import useConfirm from "@/hooks/use-confirm";

import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useEditTaskModal from "../hooks/use-edit-task-modal";
import useDeleteTask from "../api/use-delete-task";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";

interface TaskActionProps {
  taskId: string;
  children: React.ReactNode;
}
const TaskAction = ({ children, taskId }: TaskActionProps) => {
  const { open } = useEditTaskModal();
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const [ConfirmDeleteTaskDialog, confirmDeleteTask] = useConfirm(
    "Delete task",
    "This will delete the task",
    "destructive"
  );
  const { mutate } = useDeleteTask();
  const handleTaskDelete = async () => {
    const ok = await confirmDeleteTask();
    if (!ok) return;
    mutate({ param: { taskId } });
  };

  return (
    <DropdownMenu modal={false}>
      <ConfirmDeleteTaskDialog />
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[200px]">
        <DropdownMenuItem
          className="font-medium p-[10px] cursor-pointer"
          onClick={() => {
            router.push(`/workspaces/${workspaceId}/tasks/${taskId}`);
          }}
        >
          <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
          Open Task
        </DropdownMenuItem>
        <DropdownMenuItem className="font-medium p-[10px] cursor-pointer">
          <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
          Open project
        </DropdownMenuItem>
        <DropdownMenuItem
          className="font-medium p-[10px] cursor-pointer"
          onClick={() => {
            open(taskId);
          }}
        >
          <PencilIcon className="size-4 mr-2 stroke-2" />
          Edit Task
        </DropdownMenuItem>
        <DropdownMenuItem
          className="font-medium p-[10px] cursor-pointer text-destructive focus:text-destructive"
          onClick={handleTaskDelete}
        >
          <TrashIcon className="size-4 mr-2 stroke-2" />
          Remove Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskAction;
