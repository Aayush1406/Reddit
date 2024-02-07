import {
  Box,
  Button,
  Flex,
  Icon,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react";

import React, { useState } from "react";
import { FaReddit } from "react-icons/fa";
import { useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { httpGet } from "../../utils/axiosRequests";
import { useAuth } from "../../providers/auth";
import { useJoinOrLeaveCommunity } from "../../hooks/useJoinOrLeaveCommunity";

const Recommendations = () => {
  const auth = useAuth();
  const { mutateAsync } = useJoinOrLeaveCommunity();
  const [communities, setCommunities] = useState([]);
  const queryClient = useQueryClient();

  const { isLoading } = useQuery(
    "getTopCommunities",
    () =>
      httpGet({
        url: "/communities",
        service: "sne",
        headers: {
          userId: auth.session.userId,
        },
      }),
    {
      refetchOnWindowFocus: false,
      onSuccess(response) {
        const { data } = response;

        setCommunities(data);
      },
    }
  );

  const handleJoinOrLeaveCommunity = async (communityId) => {
    await mutateAsync({ communityId });

    queryClient.setQueryData("getTopCommunities", (oldQueryData) => {
      const data = oldQueryData.data;

      if (data.length) {
        const updatedData = data.map((community) =>
          community.id === communityId
            ? {
                ...community,
                isJoined: !community.isJoined,
              }
            : community
        );

        return { ...oldQueryData, data: updatedData };
      }

      return oldQueryData;
    });

    queryClient.invalidateQueries("getFeedPosts");
  };

  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      cursor="pointer"
      border="1px solid"
      borderColor="gray.300"
    >
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="70px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        bgImage="url(/images/recCommsArt.png)"
        backgroundSize="cover"
        bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75)),
        url('images/recCommsArt.png')"
      >
        Top Communities
      </Flex>
      <Flex direction="column">
        {isLoading ? (
          <Stack mt={2} p={3}>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
          </Stack>
        ) : (
          <>
            {communities.map((item, index) => {
              return (
                <Flex
                  position="relative"
                  align="center"
                  fontSize="10pt"
                  borderBottom="1px solid"
                  borderColor="gray.200"
                  p="10px 12px"
                  fontWeight={600}
                  key={item.id}
                >
                  <Flex width="80%" align="center">
                    <Flex width="15%">
                      <Text mr={2}>{index + 1}</Text>
                    </Flex>
                    <Link to={`/r/${item.slug}`}>
                      <Flex align="center">
                        <Icon
                          as={FaReddit}
                          fontSize={30}
                          color="brand.100"
                          mr={2}
                        />
                        <span>{`r/${item.slug}`}</span>
                      </Flex>
                    </Link>
                  </Flex>
                  <Box position="absolute" right="10px">
                    <Button
                      height="22px"
                      fontSize="8pt"
                      onClick={() => {
                        handleJoinOrLeaveCommunity(item.id);
                      }}
                      variant={"solid"}
                      color={item.isJoined ? "red" : "grey"}
                    >
                      {item.isJoined ? "Leave" : "Join"}
                    </Button>
                  </Box>
                </Flex>
              );
            })}
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default Recommendations;
