import { useMutation, useQueryClient } from "react-query";
import { useAuth } from "../providers/auth";
import { httpPost } from "../utils/axiosRequests";

export function useCreateCommunity(options = {}) {
  const auth = useAuth();

  const { userId } = auth.session;

  return useMutation(
    ({ title }) =>
      httpPost({
        url: "/community",
        data: {
          title,
        },
        headers: {
          userId,
        },
      }),
    {
      throwOnError: true,
      ...options,
    }
  );
}
