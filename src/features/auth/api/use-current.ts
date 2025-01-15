import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type Response = InferResponseType<(typeof client.api.auth.current)["$get"]>;
const useCurrent = () => {
  const query = useQuery<Response, Error>({
    queryKey: ["current"],
    queryFn: async () => {
      const response = await client.api.auth.current["$get"]();
      if (!response.ok) {
        throw new Error("Error getting current user");
      }
      const data = await response.json();
      return data;
    },
  });

  return query;
};

export default useCurrent;
