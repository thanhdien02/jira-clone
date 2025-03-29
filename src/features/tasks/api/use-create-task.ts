import { toast } from "sonner";
import { client } from "@/lib/rpc";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";


type ResponseType = InferResponseType<(typeof client.api.tasks)["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)["$post"]>["json"];

const useCreateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.tasks["$post"]({ json });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Task created");

      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
      queryClient.invalidateQueries({
        queryKey: ["workspace-tasks-statistics"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace-tasks-my-statistics"],
      });
    },
    onError: () => {
      toast.success("Failed to create task");
    },
  });
  return mutation;
};

export default useCreateTask;
