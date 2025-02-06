import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.projects)[":projectId"]["$patch"]
>;

const useUpdateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.projects[":projectId"]["$patch"]({
        form,
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Updated project");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
    },
    onError: () => {
      toast.error("Failed to update project");
    },
  });
  return mutation;
};

export default useUpdateProject;
