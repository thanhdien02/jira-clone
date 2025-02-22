"use client";

import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { DottedSeparator } from "./dotted-separator";
import { cn } from "@/lib/utils";

interface StatisticCountProps {
  data: {
    taskCount: number;
    taskDifferent: number;
    assignedTaskCount: number;
    assignedTaskDifferent: number;
    completedTaskCount: number;
    completedTaskDifferent: number;
    inCompleteTaskCount: number;
    inCompleteTaskDifferent: number;
    overdueTaskCount: number;
    overdueTaskDifferent: number;
  };
}
const StatisticCount = ({ data }: StatisticCountProps) => {
  return (
    <div className="w-full flex justify-between rounded-lg border border-neutral-100 overflow-x-auto">
      <StatisticItem
        name="Total Tasks"
        thisCount={data.taskCount}
        lastCount={data.taskDifferent}
      />
      <StatisticItem
        name="Assigned Tasks"
        thisCount={data.assignedTaskCount}
        lastCount={data.assignedTaskDifferent}
      />
      <StatisticItem
        name="Completed Tasks"
        thisCount={data.completedTaskCount}
        lastCount={data.completedTaskDifferent}
      />
      <StatisticItem
        name="Overdue Tasks"
        thisCount={data.overdueTaskCount}
        lastCount={data.overdueTaskDifferent}
      />
      <StatisticItem
        name="Incomplete Tasks"
        thisCount={data.inCompleteTaskCount}
        lastCount={data.inCompleteTaskDifferent}
        lastItem
      />
    </div>
  );
};

interface StatisticItemProps {
  name: string;
  thisCount: number;
  lastCount: number;
  lastItem?: boolean;
}
const StatisticItem = ({
  name,
  thisCount,
  lastCount,
  lastItem,
}: StatisticItemProps) => {
  const Icon = lastCount > 0 ? FaCaretUp : FaCaretDown;

  return (
    <div className="min-h-[100px] flex-1 flex items-center">
      <div className="flex flex-col gap-y-2 w-full p-5">
        <div className="flex items-center gap-x-2">
          <div className="font-medium text-neutral-500 whitespace-nowrap">{name}</div>
          <Icon
            className={cn(
              "size-4",
              lastCount > 0 ? "text-green-500" : "text-red-500"
            )}
          />
          <div className="">{lastCount}</div>
        </div>
        <div className="font-medium">{thisCount}</div>
      </div>
      {!lastItem && (
        <DottedSeparator className="shrink-0 ml-auto" direction="vertical" />
      )}
    </div>
  );
};

export default StatisticCount;
