"use client";

import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-react";
import { TaskStatus } from "../types";
import { snakeCaseToTitleCase } from "@/lib/utils";
import useCreateTaskModal from "../hooks/use-create-task-modal";

interface KanbanColumnProps {
  board: TaskStatus;
  taskCount: number;
}

const boardType: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: (
    <CircleDashedIcon className="size-[18px] text-pink-400" />
  ),
  [TaskStatus.TODO]: <CircleIcon className="size-[18px] text-red-400" />,
  [TaskStatus.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-[18px] text-yellow-400" />
  ),
  [TaskStatus.IN_REVIEW]: (
    <CircleDotIcon className="size-[18px] text-blue-400" />
  ),
  [TaskStatus.DONE]: (
    <CircleCheckIcon className="size-[18px] text-emerald-400" />
  ),
};

const KanbanColumn = ({ board, taskCount }: KanbanColumnProps) => {
  const { open } = useCreateTaskModal();
  const icon = boardType[board];
  return (
    <div className="flex items-center gap-x-2 mt-1 ml-1">
      {icon}
      <div className="text-sm font-medium">{snakeCaseToTitleCase(board)}</div>
      <div className="size-5 bg-neutral-200 rounded-lg flex items-center justify-center text-xs font-medium">
        {taskCount}
      </div>
      <div className="ml-auto mr-2">
        <PlusIcon
          className="text-neutral-400 cursor-pointer size-4"
          onClick={open}
        />
      </div>
    </div>
  );
};

export default KanbanColumn;
