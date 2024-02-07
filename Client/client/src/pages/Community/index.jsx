import React, { useState } from "react";
import About from "../../components/Community/About";
import CommunityNotFound from "../../components/Community/CommunityNotFound";

import Header from "../../components/Community/Header";
import PageContentLayout from "../../components/Layout/PageContent";
import Posts from "../../components/Post/Posts";

import { useQuery } from "react-query";
import { httpGet } from "../../utils/axiosRequests";
import { useParams } from "react-router-dom";
import { useAuth } from "../../providers/auth";

const communityData = {
  id: "123123-123",
  slug: "javaprogramming",
  title: "Java Programming",
  creatorId: 312,
  numberOfMembers: 4123,
  privacyType: "public",
  createdAt: new Date(),
  backgroundImg:
    "https://images.unsplash.com/photo-1543013309-0d1f4edeb868?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxNDM2NDd8MHwxfHNlYXJjaHwxfHxqYXZhfGVufDB8fHx8MTY4Mzc3MzkyMnww&ixlib=rb-4.0.3&q=85",
};

const CommunityPage = () => {
  const [communityData, setCommunityData] = useState(null);
  const { communityId } = useParams();
  const auth = useAuth();

  const { isLoading } = useQuery(
    `getCommunity-${communityId}`,
    () =>
      httpGet({
        url: "/community/" + communityId,
        service: "sne",
        headers: {
          userId: auth.session.userId,
        },
      }),
    {
      refetchOnWindowFocus: false,
      onSuccess(response) {
        const { data } = response;

        setCommunityData(data);
      },
    }
  );

  if (isLoading || !communityData) {
    return <>loading....</>;
  }

  return (
    <>
      <Header communityData={communityData} />
      {communityData.isJoined && (
        <PageContentLayout>
          <>
            <Posts communityId={communityId} />
          </>
          <>
            <About communityData={communityData} />
          </>
        </PageContentLayout>
      )}
    </>
  );
};

export default CommunityPage;
