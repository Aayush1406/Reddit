import { Stack } from "@chakra-ui/react";

import Recommendations from "../../components/Community/Recommendations";
import PageContentLayout from "../../components/Layout/PageContent";
import PostLoader from "../../components/Post/Loader";
import PostItem from "../../components/Post/PostItem";
import PersonalHome from "../../components/Community/PersonalHome";
import { httpGet } from "../../utils/axiosRequests";
import { useQuery } from "react-query";
import { useAuth } from "../../providers/auth";
import { useState } from "react";

const Home = () => {
  const auth = useAuth();
  const [posts, setPosts] = useState([]);

  const { isLoading } = useQuery(
    "getFeedPosts",
    () =>
      httpGet({
        url: "/posts/feed",
        service: "sne",
        headers: {
          userId: auth.session.userId,
        },
      }),
    {
      refetchOnWindowFocus: false,
      onSuccess(response) {
        const { data } = response;

        setPosts(data);
      },
    }
  );

  return (
    <>
      <PageContentLayout>
        <>
          {isLoading ? (
            <PostLoader />
          ) : (
            <Stack>
              {posts.map((post, index) => (
                <PostItem
                  key={post.pdsId}
                  post={post}
                  postIdx={index}
                  onVote={() => null}
                  onDeletePost={() => null}
                  userVoteValue={3123}
                  userIsCreator={false}
                  onSelectPost={() => null}
                  homePage
                />
              ))}
            </Stack>
          )}
        </>
        <Stack spacing={5} position="sticky" top="14px">
          <Recommendations />
          <PersonalHome />
        </Stack>
      </PageContentLayout>
    </>
  );
};

export default Home;
