import React from "react";
import { Box, Button, Flex, Text, Image } from "@chakra-ui/react";
import { useJoinOrLeaveCommunity } from "../../hooks/useJoinOrLeaveCommunity";
import { useQueryClient } from "react-query";

const Header = ({ communityData }) => {
  const { mutateAsync } = useJoinOrLeaveCommunity();
  const queryClient = useQueryClient();

  const handleJoinOrLeaveCommunity = async (communityId) => {
    await mutateAsync({ communityId });

    queryClient.setQueryData(
      `getCommunity-${communityData.slug}`,
      (oldQueryData) => {
        const data = oldQueryData.data;

        if (data) {
          const updatedData = {
            ...data,
            isJoined: !data.isJoined,
          };

          return { ...oldQueryData, data: updatedData };
        }

        return oldQueryData;
      }
    );
  };

  return (
    <Flex direction="column" width="100%" height="350px">
      <Box
        height="300px"
        bg={
          communityData.imageURL
            ? `url(${communityData.imageURL}) no-repeat center`
            : "blue.400"
        }
      />
      <Flex justifyContent="center" bg="white">
        <Flex width="95%" maxWidth="860px">
          <Image
            borderRadius="full"
            boxSize="66px"
            src={
              "https://preview.redd.it/aa8gv3i1n8a71.png?width=587&format=png&auto=webp&s=be968a6cfd9203dc6c22d0859f9fd353efacc346"
            }
            alt="Dan Abramov"
            position="relative"
            top={-3}
            color="blue.500"
            border="4px solid white"
          />
          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontWeight={800} fontSize="16pt">
                {communityData.title}
              </Text>
              <Text fontWeight={600} fontSize="10pt" color="gray.400">
                r/{communityData.slug}
              </Text>
            </Flex>
            <Flex>
              <Button
                variant={communityData.isJoined ? "outline" : "solid"}
                height="30px"
                pr={6}
                pl={6}
                onClick={() => {
                  handleJoinOrLeaveCommunity(communityData.id);
                }}
                isLoading={false}
                colorScheme={communityData.isJoined ? "red" : "blue"}
              >
                {communityData.isJoined ? "Leave" : "Join"}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Header;
