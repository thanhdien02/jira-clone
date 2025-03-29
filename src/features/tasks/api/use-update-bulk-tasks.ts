import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)["bulk-update"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)["bulk-update"]["$patch"]
>;

const useUpdateBulkTasks = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks["bulk-update"]["$patch"]({
        json,
      });
      if (!response.ok) {
        throw new Error("Failed to update tasks");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Tasks updated");
      queryClient.invalidateQueries({
        queryKey: ["workspace-tasks-statistics"],
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({
        queryKey: ["workspace-tasks-my-statistics"],
      });
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });
  return mutation;
};

export default useUpdateBulkTasks;
