import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Button,
  Textarea,
  Select,
  Stack,
  FormControl,
  FormErrorMessage,
  HStack,
  Text,
} from "@chakra-ui/react";
import { useQuery, useQueryClient } from "react-query";
import { httpGet } from "../../utils/axiosRequests";
import { useAuth } from "../../providers/auth";
import { useCreatePost } from "../../hooks/useCreatePost";

const CreateCommunityModal = ({ onClose, isOpen }) => {
  const auth = useAuth();
  const { mutateAsync } = useCreatePost();

  const queryClient = useQueryClient();

  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { isFetching } = useQuery(
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

        if (data.length) {
          const opts = data
            .filter((community) => community.isJoined)
            .map((community) => ({
              id: community.id,
              slug: community.slug,
              title: community.title,
            }));
          setOptions(opts);
        }
      },
    }
  );

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    if (!content || !selectedOption) {
      setError("Community and Content are required.");
      return;
    }

    try {
      await mutateAsync({ communityId: selectedOption, content });

      setLoading(false);
      onClose();
    } catch (e) {
      setError("Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      isCentered
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a Post</ModalHeader>
        <ModalBody>
          <FormControl isInvalid={!!error}>
            <Stack gap={"12px"}>
              <Stack>
                <Text fontSize={"md"}>
                  Choose a community that you have already joined:
                </Text>
                <Select
                  value={selectedOption}
                  onChange={handleOptionChange}
                  placeholder="--"
                  isDisabled={isFetching}
                >
                  {options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.title} ({`r/${option.slug}`})
                    </option>
                  ))}
                </Select>
              </Stack>
              <Textarea
                placeholder="Write the content of the post here!"
                size="sm"
                resize={"vertical"}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Stack>
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter gap={"8px"}>
          <Button onClick={onClose} size="sm" isDisabled={loading}>
            Close
          </Button>
          <Button
            onClick={handleSubmit}
            size="sm"
            colorScheme="messenger"
            isLoading={loading}
          >
            Post
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateCommunityModal;
