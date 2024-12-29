import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<(typeof client.api.auth.register)["$post"]>;
type RequestType = InferRequestType<
  (typeof client.api.auth.register)["$post"]
>["json"];

const useRegister = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.auth.register["$post"]({ json });
      if (!response) {
        throw new Error("Error registering user");
      }
      return response.json();
    },
  });
  return mutation;
};

export default useRegister;