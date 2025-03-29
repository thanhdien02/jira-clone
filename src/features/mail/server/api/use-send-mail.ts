import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.mail)["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.mail)["$post"]>["json"];

const useSendMail = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.mail["$post"]({ json });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Mail sent");
    },
    onError: () => {
      toast.success("Failed to create project");
    },
  });
  return mutation;
};

export default useSendMail;
