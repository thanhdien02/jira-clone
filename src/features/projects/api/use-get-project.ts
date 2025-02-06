import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetProjectProps {
  projectId: string;
  workspaceId: string;
}
const useGetProject = ({ workspaceId, projectId }: UseGetProjectProps) => {
  const query = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"].$get({
        param: { projectId },
        query: { workspaceId },
      });
      if (!response.ok) {
        throw new Error("Failed to get project");
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

export default useGetProject;
