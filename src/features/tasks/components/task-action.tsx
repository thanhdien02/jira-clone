"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import React from "react";
import useEditTaskModal from "../hooks/use-edit-task-modal";

interface TaskActionProps {
  taskId: string;
  children: React.ReactNode;
}
const TaskAction = ({ children, taskId }: TaskActionProps) => {
  const { open } = useEditTaskModal();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[200px]">
        <DropdownMenuItem className="font-medium p-[10px] cursor-pointer">
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
        <DropdownMenuItem className="font-medium p-[10px] cursor-pointer text-destructive focus:text-destructive">
          <TrashIcon className="size-4 mr-2 stroke-2" />
          Remove Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskAction;
