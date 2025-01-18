import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetWorkspaceProps {
  workspaceId: string;
}
const useGetWorkspace = ({ workspaceId }: UseGetWorkspaceProps) => {
  const mutation = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"]["$get"]({
        param: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("Failed to update workspace");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return mutation;
};

export default useGetWorkspace;
