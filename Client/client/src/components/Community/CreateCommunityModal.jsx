import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Stack,
  FormControl,
  FormErrorMessage,
  Input,
} from "@chakra-ui/react";
import { useQueryClient } from "react-query";
import { useCreateCommunity } from "../../hooks/useCreateCommunity";

const CreatePostModal = ({ onClose, isOpen }) => {
  const { mutateAsync } = useCreateCommunity();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    if (!title) {
      setError("Community title is required.");
      return;
    }

    try {
      await mutateAsync({ title });
      queryClient.invalidateQueries("getTopCommunities");

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
        <ModalHeader>Create a Community</ModalHeader>
        <ModalBody>
          <FormControl isInvalid={!!error}>
            <Stack gap={"12px"}>
              <Input
                placeholder="Title of the community"
                size="sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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

export default CreatePostModal;
