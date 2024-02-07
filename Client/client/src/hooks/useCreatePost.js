import { useMutation, useQueryClient } from "react-query";
import { useAuth } from "../providers/auth";
import { createPost } from "../services/post";

export function useCreatePost(options = {}) {
  const auth = useAuth();
  const queryClient = useQueryClient();

  const { userId, rsaPubKey, sharedSecret } = auth.session;

  return useMutation(
    ({ communityId, content }) =>
      createPost({
        communityId,
        content,
        userId,
        rsaPubKey,
        sharedSecret,
      }),
    {
      throwOnError: true,
      ...options,
      onSuccess() {
        queryClient.invalidateQueries("getFeedPosts");
      },
    }
  );
}
