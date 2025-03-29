import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetWorkspacesMyStatisticsProps {
  workspaceId: string;
}
const useGetWorkspaceMyStatistics = ({
  workspaceId,
}: UseGetWorkspacesMyStatisticsProps) => {
  const query = useQuery({
    queryKey: ["workspace-tasks-my-statistics", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"][
        "my-statistic"
      ].$get({
        param: {
          workspaceId,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to get workspace my statistics");
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

export default useGetWorkspaceMyStatistics;
