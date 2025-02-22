"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Member } from "@/features/members/types";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { Project } from "@/features/projects/types";
import { cn, snakeCaseToTitleCase } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";
import { PencilIcon } from "lucide-react";
import { Task, TaskStatus } from "../types";
import useEditTaskModal from "../hooks/use-edit-task-modal";

interface TaskInformationProps {
  data: Task & { assignee: Member; project: Project };
}
const TaskInformation = ({ data }: TaskInformationProps) => {
  const { open } = useEditTaskModal();

  const today = new Date();
  const endDate = new Date(data?.dueDate as string);
  const diffInDays = differenceInDays(endDate, today);

  let textColor = "text-muted-foreground";

  if (diffInDays <= 3) {
    textColor = "text-red-500";
  } else if (diffInDays <= 7) {
    textColor = "text-orange-500";
  } else if (diffInDays <= 14) {
    textColor = "text-yellow-500";
  }

  return (
    <div className="flex-1 h-fit bg-gray-100 rounded-lg p-5">
      <div className="flex items-center justify-between">
        <h4 className="font-medium w-full mb-2">Task information</h4>
        <Button
          size={"xs"}
          onClick={() => {
            open(data.$id);
          }}
          variant={"secondary"}
          className="gap-x-1 text-sm"
        >
          <PencilIcon className="size-4" />
          Edit
        </Button>
      </div>
      <div className="flex flex-col gap-y-3">
        <div>
          <p className="line-clamp-1 w-full">{data?.name}</p>
        </div>

        <div className="flex items-center gap-x-3 flex-wrap">
          <div className="flex items-center gap-x-2">
            <ProjectAvatar
              name="Project"
              src={data?.project.imageUrl as string}
            />
            <p className="max-w-[120px] truncate">{data?.project.name}</p>
          </div>
          <div className=" text-neutral-500 flex items-center gap-x-2">
            <MemberAvatar name="Assignee" key={data?.assignee.name} />
            <p className="max-w-[120px] truncate">{data?.assignee.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-x-3">
          <Badge variant={data?.status as TaskStatus}>
            {snakeCaseToTitleCase(data?.status as string)}
          </Badge>
          <p className={cn("text-sm", textColor)}>
            {format(data?.dueDate as string, "PPP")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskInformation;
