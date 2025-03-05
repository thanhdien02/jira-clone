import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetWorkspacesStatisticsProps {
  workspaceId: string;
}
const useGetWorkspaceStatistics = ({
  workspaceId,
}: UseGetWorkspacesStatisticsProps) => {
  const query = useQuery({
    queryKey: ["workspace-tasks-statistics", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[
        ":workspaceId"
      ].statistics.$get({
        param: {
          workspaceId,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to get workspace statistics");
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

export default useGetWorkspaceStatistics;
