import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetTasksProps {
  projectId: string;
  workspaceId: string;
}
const useGetTasks = ({ workspaceId, projectId }: UseGetTasksProps) => {
  const query = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: { workspaceId, projectId },
      });
      if (!response.ok) {
        throw new Error("Failed to get tasks");
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

export default useGetTasks;
