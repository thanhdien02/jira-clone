"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Task } from "../types";
import { DottedSeparator } from "@/components/dotted-separator";
import TaskAction from "./task-action";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "./task-date";
import ProjectAvatar from "@/features/projects/components/project-avatar";

interface KanbanCardProps {
  data: Task;
}

const KanbanCard = ({ data }: KanbanCardProps) => {
  return (
    <div className="bg-white rounded-md p-2 my-2 min-h-[100px]">
      <div className="flex justify-between items-center">
        <div className="text-sm line-clamp-2">{data.name}</div>
        <TaskAction taskId="">
          <DotsHorizontalIcon className="size-4 text-neutral-500" />
        </TaskAction>
      </div>
      <DottedSeparator className="my-2" />
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-x-2">
          <MemberAvatar name={data?.project?.name} />
          <div className="size-1 rounded-full bg-neutral-500 shrink-0"></div>
          <TaskDate value={data?.dueDate} className="text-xs" />
        </div>
        <div className="flex items-center gap-3">
          <ProjectAvatar
            name={data?.project?.name}
            src={data?.project?.imageUrl}
          />
          <div className="text-xs">{data?.project?.name}</div>
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
