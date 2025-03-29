"use client";

import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { DottedSeparator } from "./dotted-separator";
import { cn } from "@/lib/utils";

interface MyStatisticCountProps {
  data: {
    taskThisMonthCount: number;
    taskDifferentCount: number;
    taskThisMonthCompletedCount: number;
    taskDifferentCompletedCount: number;
    taskThisMonthInCompletedCount: number;
    taskDifferentInCompletedCount: number;
    taskThisMonthOverDueCount: number;
    taskDifferentOverDueCount: number;
  };
}
const MyStatisticCount = ({ data }: MyStatisticCountProps) => {
  return (
    <div className="w-full flex justify-between rounded-lg border border-neutral-100 overflow-x-auto">
      <StatisticItem
        name="All Tasks"
        thisCount={data.taskThisMonthCount}
        lastCount={data.taskDifferentCount}
      />
      <StatisticItem
        name="Completed Tasks"
        thisCount={data.taskThisMonthCompletedCount}
        lastCount={data.taskDifferentCompletedCount}
      />
      <StatisticItem
        name="Overdue Tasks"
        thisCount={data.taskThisMonthOverDueCount}
        lastCount={data.taskDifferentOverDueCount}
      />
      <StatisticItem
        name="Incomplete Tasks"
        thisCount={data.taskThisMonthInCompletedCount}
        lastCount={data.taskDifferentInCompletedCount}
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
          <div className="font-medium text-neutral-500 whitespace-nowrap">
            {name}
          </div>
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

export default MyStatisticCount;
