"use client";

import StatisticCount from "@/components/statistics-count";
import useGetWorkspaceStatistics from "@/features/workspaces/api/use-get-workspace-statistics";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";

const DashboardWorkspaceClient = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspaceStatistics({ workspaceId });
  console.log("🚀 ~ DashboardWorkspaceClient ~ data:", data);

  if (isLoading || !data) {
    return (
      <div className="py-80 flex items-center justify-center">
        <Loader className="size-5 text-neutral-500 animate-spin" />
      </div>
    );
  }
  return (
    <div className="p-5">
      <StatisticCount data={data} />
    </div>
  );
};

export default DashboardWorkspaceClient;
