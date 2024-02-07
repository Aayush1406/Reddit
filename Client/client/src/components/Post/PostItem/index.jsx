import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Flex,
  Icon,
  Stack,
  Text,
  Button,
  FormErrorMessage,
} from "@chakra-ui/react";

import { BsDot } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import {
  IoArrowDownCircleOutline,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoBookmarkOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import { useAuth } from "../../../providers/auth";
import { getPostContent } from "../../../services/post";
import { aesDecrypt } from "../../../utils/aes";
import { verifySignature } from "../../../utils/rsa";

const PostItem = ({ post, postIdx, onVote, onSelectPost, homePage }) => {
  const auth = useAuth();
  const [content, setContent] = useState("");
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [error, setError] = useState("");

  const singlePostView = false; // function not passed to [pid]

  const handleViewContent = async () => {
    setError("");
    setIsContentLoading(true);
    try {
      const content = await getPostContent(post.pdsId, auth.session.userId);

      if (!content.data || !content.signature) {
        setError("Bad content response!");
        return;
      }

      console.log("Decrypting the payload....");

      const decryptedPayload = aesDecrypt(
        content.data,
        auth.session.sharedSecret
      );

      console.log("Verifying the signature....");

      const isSignatureValid = await verifySignature(
        decryptedPayload,
        content.signature
      );

      console.log("Signature matched....!!!!");

      if (!isSignatureValid) {
        setError("Couldn't verify digital signature!");
        return;
      }

      const postData = JSON.parse(decryptedPayload)[0];
      setIsContentLoading(false);
      console.log(
        "Successfully decrypted the payload: " + postData.postContent
      );
      setContent(postData.postContent);
    } catch (err) {
      setError("Something went wrong!");

      setIsContentLoading(false);
    }
  };

  return (
    <Flex
      border="1px solid"
      bg="white"
      borderColor={singlePostView ? "white" : "gray.300"}
      borderRadius={singlePostView ? "4px 4px 0px 0px" : 4}
      _hover={{ borderColor: singlePostView ? "none" : "gray.500" }}
      onClick={() => onSelectPost && post && onSelectPost(post, postIdx)}
    >
      <Flex
        direction="column"
        align="center"
        bg={singlePostView ? "none" : "gray.100"}
        p={2}
        width="40px"
        borderRadius={singlePostView ? "0" : "3px 0px 0px 3px"}
      >
        <Icon
          as={IoArrowUpCircleOutline}
          color={content ? "#4379FF" : "gray.400"}
          fontSize={22}
          cursor="pointer"
          onClick={() => {}}
        />
        <Text fontSize="9pt" fontWeight={600}>
          {post.likesCount}
        </Text>
        <Icon
          as={IoArrowDownCircleOutline}
          fontSize={22}
          color={content ? "brand.100" : "gray.400"}
          cursor="pointer"
          onClick={() => null}
          _disabled={!content}
        />
      </Flex>
      <Flex direction="column" width="100%">
        <Stack spacing={1} p="10px 10px">
          {!!post.created_at && (
            <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
              {homePage && (
                <>
                  <Icon as={FaReddit} fontSize={18} mr={1} color="blue.500" />
                  <Link to={`/r/${post.community.slug}`}>
                    <Text
                      fontWeight={700}
                      _hover={{ textDecoration: "underline" }}
                    >{`r/${post.community.slug}`}</Text>
                  </Link>
                  <Icon as={BsDot} color="gray.500" fontSize={8} />
                </>
              )}
              <Text color="gray.500">
                Posted by u/{post.creator.email.split("@")[0]}
                {" · "}
                {formatDistanceToNow(new Date(post.created_at), {
                  locale: enUS,
                })}{" "}
                ago
              </Text>
            </Stack>
          )}
          {content ? (
            <>
              <Text fontSize="12pt" fontWeight={600}>
                {getWordStr(content)}
              </Text>
              <Text fontSize="10pt">{content}</Text>
            </>
          ) : (
            <Flex
              width={"100%"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Button
                size={"sm"}
                colorScheme="gray"
                onClick={handleViewContent}
                isLoading={isContentLoading}
              >
                View content
              </Button>
            </Flex>
          )}
        </Stack>
        <FormErrorMessage> {error} </FormErrorMessage>
        <Flex ml={1} mb={0.5} color="gray.500" fontWeight={600}>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize="9pt">Share</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize="9pt">Save</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

function getWordStr(str) {
  return str.split(/\s+/).slice(0, 5).join(" ");
}

export default PostItem;
