"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import React from "react";

interface TaskActionProps {
  children: React.ReactNode;
}
const TaskAction = ({ children }: TaskActionProps) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="font-medium p-[10px]">
          <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
          Open Task
        </DropdownMenuItem>
        <DropdownMenuItem className="font-medium p-[10px]">
          <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
          Open project
        </DropdownMenuItem>
        <DropdownMenuItem className="font-medium p-[10px]">
          <PencilIcon className="size-4 mr-2 stroke-2" />
          Edit Task
        </DropdownMenuItem>
        <DropdownMenuItem className="font-medium p-[10px]">
          <TrashIcon className="size-4 mr-2 stroke-2" />
          Remove Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskAction;
