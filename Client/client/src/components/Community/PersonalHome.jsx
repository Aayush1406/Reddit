import React, { useState } from "react";
import { Button, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { FaReddit } from "react-icons/fa";
import CreatePostModal from "./CreatePostModal";
import CreateCommunityModal from "./CreateCommunityModal";

const PersonalHome = () => {
  const [openModal, setOpenModal] = useState("");

  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      cursor="pointer"
      border="1px solid"
      borderColor="gray.300"
      position="sticky"
    >
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="34px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        bgImage="url(/images/redditPersonalHome.png)"
        backgroundSize="cover"
      ></Flex>
      <Flex direction="column" p="12px">
        <Flex align="center" mb={2}>
          <Icon as={FaReddit} fontSize={50} color="brand.100" mr={2} />
          <Text fontWeight={600}>Home</Text>
        </Flex>
        <Stack spacing={3}>
          <Text fontSize="9pt">
            Your personal Reddit frontpage, built for you.
          </Text>
          <Button
            height="30px"
            onClick={() => {
              setOpenModal("create-post");
            }}
          >
            Create Post
          </Button>
          <Button
            variant="outline"
            height="30px"
            onClick={() => {
              setOpenModal("create-community");
            }}
          >
            Create Community
          </Button>
          <CreatePostModal
            onClose={() => {
              setOpenModal("");
            }}
            isOpen={openModal === "create-post"}
          />
          <CreateCommunityModal
            onClose={() => {
              setOpenModal("");
            }}
            isOpen={openModal === "create-community"}
          />
        </Stack>
      </Flex>
    </Flex>
  );
};

export default PersonalHome;
