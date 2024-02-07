import React, { useEffect, useState, useCallback } from "react";
import { Stack } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useLocation, useParams } from "react-router-dom";

import { httpGet } from "../../utils/axiosRequests";
import PostLoader from "./Loader";
import PostItem from "./PostItem";
import { useAuth } from "../../providers/auth";

const postArr = [
  {
    id: "12312",
    communityId: "loremipsum",
    communityImageURL:
      "https://preview.redd.it/aa8gv3i1n8a71.png?width=587&format=png&auto=webp&s=be968a6cfd9203dc6c22d0859f9fd353efacc346",
    userDisplayText: "meetalodariya",
    creatorId: "12312",
    title: "My post my title",
    body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin augue urna, sollicitudin nec est non, fermentum condimentum dui. Nam in magna tincidunt, porttitor felis sit amet, congue enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque lacus quam, fermentum sed urna quis, mattis eleifend ante. Suspendisse commodo lobortis purus nec sodales. Sed non egestas urna. Nunc ex nibh, luctus eu quam semper, dapibus scelerisque velit. Morbi viverra nibh non ex vulputate, at ultrices tortor hendrerit. Nunc dolor nisl, laoreet quis eros sodales, convallis consectetur orci. Vivamus sodales eu elit sed sodales. Donec eleifend urna lorem, nec tincidunt odio sagittis ac. Sed posuere eros eget purus rutrum vulputate. Ut posuere mauris augue, vulputate varius nunc faucibus quis. In hac habitasse platea dictumst.

    Mauris non blandit augue. Proin tincidunt consectetur nulla, ac pretium eros placerat vitae. In tincidunt nisi eu purus porta, eu finibus diam porta. Curabitur dictum, purus a viverra laoreet, purus diam rutrum nibh, at fringilla sapien mi quis neque. Proin in leo nisi. Nullam non tristique diam, quis egestas odio. Nulla dictum facilisis nulla sagittis posuere. Morbi risus quam, mollis ac purus sed, fringilla eleifend augue. Nam tempus risus vel libero semper, id varius mi dignissim. Cras porttitor a est sed iaculis. Mauris rutrum justo sit amet lacus accumsan fermentum. Praesent tempor erat non dui suscipit, quis rutrum metus vestibulum. Nulla quam lectus, pharetra ac augue a, ultrices tincidunt sem.`,
    numberOfComments: 2,
    voteStatus: 3,
    currentUserVoteStatus: {
      id: "1231",
      voteValue: 23,
    },
    imageURL: "",
    postIdx: 1,
    createdAt: new Date(),
    editedAt: new Date(),
  },
  {
    id: "12312",
    communityId: "loremipsum",
    communityImageURL:
      "https://preview.redd.it/aa8gv3i1n8a71.png?width=587&format=png&auto=webp&s=be968a6cfd9203dc6c22d0859f9fd353efacc346",
    userDisplayText: "meetalodariya",
    creatorId: "12312",
    title: "My post my title",
    body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin augue urna, sollicitudin nec est non, fermentum condimentum dui. Nam in magna tincidunt, porttitor felis sit amet, congue enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque lacus quam, fermentum sed urna quis, mattis eleifend ante. Suspendisse commodo lobortis purus nec sodales. Sed non egestas urna. Nunc ex nibh, luctus eu quam semper, dapibus scelerisque velit. Morbi viverra nibh non ex vulputate, at ultrices tortor hendrerit. Nunc dolor nisl, laoreet quis eros sodales, convallis consectetur orci. Vivamus sodales eu elit sed sodales. Donec eleifend urna lorem, nec tincidunt odio sagittis ac. Sed posuere eros eget purus rutrum vulputate. Ut posuere mauris augue, vulputate varius nunc faucibus quis. In hac habitasse platea dictumst.

    Mauris non blandit augue. Proin tincidunt consectetur nulla, ac pretium eros placerat vitae. In tincidunt nisi eu purus porta, eu finibus diam porta. Curabitur dictum, purus a viverra laoreet, purus diam rutrum nibh, at fringilla sapien mi quis neque. Proin in leo nisi. Nullam non tristique diam, quis egestas odio. Nulla dictum facilisis nulla sagittis posuere. Morbi risus quam, mollis ac purus sed, fringilla eleifend augue. Nam tempus risus vel libero semper, id varius mi dignissim. Cras porttitor a est sed iaculis. Mauris rutrum justo sit amet lacus accumsan fermentum. Praesent tempor erat non dui suscipit, quis rutrum metus vestibulum. Nulla quam lectus, pharetra ac augue a, ultrices tincidunt sem.`,
    numberOfComments: 2,
    voteStatus: 3,
    currentUserVoteStatus: {
      id: "1231",
      voteValue: 23,
    },
    imageURL: "",
    postIdx: 1,
    createdAt: new Date(),
    editedAt: new Date(),
  },
  {
    id: "12312",
    communityId: "loremipsum",
    communityImageURL:
      "https://preview.redd.it/aa8gv3i1n8a71.png?width=587&format=png&auto=webp&s=be968a6cfd9203dc6c22d0859f9fd353efacc346",
    userDisplayText: "meetalodariya",
    creatorId: "12312",
    title: "My post my title",
    body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin augue urna, sollicitudin nec est non, fermentum condimentum dui. Nam in magna tincidunt, porttitor felis sit amet, congue enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque lacus quam, fermentum sed urna quis, mattis eleifend ante. Suspendisse commodo lobortis purus nec sodales. Sed non egestas urna. Nunc ex nibh, luctus eu quam semper, dapibus scelerisque velit. Morbi viverra nibh non ex vulputate, at ultrices tortor hendrerit. Nunc dolor nisl, laoreet quis eros sodales, convallis consectetur orci. Vivamus sodales eu elit sed sodales. Donec eleifend urna lorem, nec tincidunt odio sagittis ac. Sed posuere eros eget purus rutrum vulputate. Ut posuere mauris augue, vulputate varius nunc faucibus quis. In hac habitasse platea dictumst.

    Mauris non blandit augue. Proin tincidunt consectetur nulla, ac pretium eros placerat vitae. In tincidunt nisi eu purus porta, eu finibus diam porta. Curabitur dictum, purus a viverra laoreet, purus diam rutrum nibh, at fringilla sapien mi quis neque. Proin in leo nisi. Nullam non tristique diam, quis egestas odio. Nulla dictum facilisis nulla sagittis posuere. Morbi risus quam, mollis ac purus sed, fringilla eleifend augue. Nam tempus risus vel libero semper, id varius mi dignissim. Cras porttitor a est sed iaculis. Mauris rutrum justo sit amet lacus accumsan fermentum. Praesent tempor erat non dui suscipit, quis rutrum metus vestibulum. Nulla quam lectus, pharetra ac augue a, ultrices tincidunt sem.`,
    numberOfComments: 2,
    voteStatus: 3,
    currentUserVoteStatus: {
      id: "1231",
      voteValue: 23,
    },
    imageURL: "",
    postIdx: 1,
    createdAt: new Date(),
    editedAt: new Date(),
  },
];

const Posts = ({ communityId }) => {
  const [posts, setPosts] = useState([]);
  const auth = useAuth();

  const { isLoading } = useQuery(
    `getCommunityPosts-${communityId}`,
    () =>
      httpGet({
        url: "/posts/community/" + communityId,
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
            />
          ))}
        </Stack>
      )}
    </>
  );
};

export default Posts;
