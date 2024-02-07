import { useMutation, useQueryClient } from "react-query";
import { useAuth } from "../providers/auth";
import { httpPost } from "../utils/axiosRequests";

export function useJoinOrLeaveCommunity(options = {}) {
  const auth = useAuth();

  const { userId } = auth.session;

  return useMutation(
    ({ communityId }) =>
      httpPost({
        url: "/community/joinOrLeave",
        headers: {
          userId,
        },
        data: {
          communityId,
        },
      }),
    {
      throwOnError: true,
      ...options,
    }
  );
}
