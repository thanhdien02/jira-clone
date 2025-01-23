import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.projects)["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.projects)["$post"]
>["form"];

const useCreateProject = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (form) => {
      const response = await client.api.projects["$post"]({ form });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Created project");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
    },
    onError: () => {
      toast.success("Failed to create project");
    },
  });
  return mutation;
};

export default useCreateProject;
