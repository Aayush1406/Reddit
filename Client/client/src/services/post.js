import { getSignature } from "../utils/rsa";
import { aesEncrypt } from "../utils/aes";
import { httpGet, httpPost } from "../utils/axiosRequests";

const createPostPds = async ({ content, userId, rsaPubKey, sharedSecret }) => {
  const encryptedPayload = aesEncrypt(content, sharedSecret);

  const signature = await getSignature(content, rsaPubKey);
  console.log("---------------------------------------");
  console.log("Creating the post on PDS with: ");
  console.log({ encryptedPayload });
  console.log({ digitalSignature: signature });

  const { data, status, error } = await httpPost({
    url: "/post",
    data: {
      encryptedContent: encryptedPayload,
      postDigitalSignature: signature,
    },
    headers: {
      userId,
    },
    service: "pds",
  });

  if (status === 200 && data?.postId) {
    return data.postId;
  } else if (error) {
    throw new Error(error);
  }
};

const createPostSNE = async (userId, communityId, pdsId) => {
  console.log("---------------------------------------");
  console.log("storing the metadata of a post on SNE");

  const { status, error } = await httpPost({
    url: "/post",
    data: {
      pdsId,
      communityId,
    },
    headers: {
      userId,
    },
    service: "sne",
  });

  if (status !== 200 || error) {
    console.log("error block sign up sne");
    throw new Error(error);
  }
};

export const createPost = async ({
  communityId,
  content,
  userId,
  rsaPubKey,
  sharedSecret,
}) => {
  const pdsPostId = await createPostPds({
    content,
    userId,
    rsaPubKey,
    sharedSecret,
  });

  console.log("---------------------------------------");
  console.log("created a post on PDS with ID: " + pdsPostId);

  await createPostSNE(userId, communityId, pdsPostId);
};

export const getPostContent = async (id, userId) => {
  const { data, status, error } = await httpGet({
    url: `/post/${id}`,
    headers: {
      userId: userId,
    },
  });

  if (status === 200 && data) {
    return data;
  } else if (error) {
    throw new Error(error);
  }
};
