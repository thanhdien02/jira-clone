import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

const useGetWorkspaces = () => {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.workspaces.$get();

      if (!response.ok) {
        throw new Error("Failed to get workspace");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

export default useGetWorkspaces;
