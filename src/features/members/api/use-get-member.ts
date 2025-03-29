import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
interface UseGetMemberProps {
  userId: string;
  workspaceId: string;
}
const useGetMember = ({ userId, workspaceId }: UseGetMemberProps) => {
  const query = useQuery({
    queryKey: ["member-info", workspaceId],
    queryFn: async () => {
      const response = await client.api.members.info.$get({
        query: { userId, workspaceId },
      });
      if (!response.ok) {
        throw new Error("Failed to get member info");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

export default useGetMember;
