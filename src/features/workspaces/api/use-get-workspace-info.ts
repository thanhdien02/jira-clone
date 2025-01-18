import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetWorkspaceInfoProps {
  workspaceId: string;
}

const useGetWorkspaceInfo = ({ workspaceId }: UseGetWorkspaceInfoProps) => {
  const mutation = useQuery({
    queryKey: ["workspaceInfo", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"]["info"][
        "$get"
      ]({
        param: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("Failed to get workspace info");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return mutation;
};

export default useGetWorkspaceInfo;
