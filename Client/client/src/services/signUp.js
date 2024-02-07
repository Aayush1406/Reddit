import { initSecure } from "./initSecure";
import {
  computeSharedSecret,
  getDiffieHellmanKeyPair,
} from "../utils/diffieHellman";
import { getRSAKeyPair, getSignature } from "../utils/rsa";
import { aesEncrypt } from "../utils/aes";
import { httpPost } from "../utils/axiosRequests";

const signUpPDS = async (username, password, sharedSecret, serverRsaPubKey) => {
  const { publicKey: clientDhPublicKey } = getDiffieHellmanKeyPair();
  const { publicKey: clientRsaPublicKey } = getRSAKeyPair();

  const payload = JSON.stringify({ username, password });

  console.log("Encrypting the sign up data payload: " + payload);

  const encryptedPayload = aesEncrypt(payload, sharedSecret);

  console.log("Generating the signature: " + payload);

  const signature = await getSignature(payload, serverRsaPubKey);

  console.log("---------------------------------------");
  console.log("Signing up the user on PDS with:");
  console.log({ encryptedPayload });
  console.log({ signature });
  console.log({ clientDhPublicKey });
  console.log({ clientRsaPublicKey });

  const { data, status, error } = await httpPost({
    url: "/register",
    data: {
      userPublicKey: clientDhPublicKey,
      rsaUserPublicKey: clientRsaPublicKey,
      encryptedData: encryptedPayload,
      rsaSignature: signature,
    },
    service: "pds",
  });

  if (status === 200 && data?.userId) {
    return data.userId;
  } else if (error) {
    throw new Error(error);
  }
};

const signUpSNE = async (username, password, verificationKey, pdsUserId) => {
  console.log("---------------------------------------");
  console.log("Signing up the user on SNE with pdsUserID: " + pdsUserId);
  console.log({ verificationKey });

  const { status, error } = await httpPost({
    url: "/signup",
    data: {
      email: username,
      password,
      pdsId: `${pdsUserId}`,
      verification_key: verificationKey,
    },
    service: "sne",
  });

  if (status !== 200 || error) {
    console.log("error block sign up sne");
    throw new Error(error);
  }
};

export const signUpWorkflow = async (username, password, verificationKey) => {
  const { serverRsaPubKey, serverDhPubKey } = await initSecure();

  console.log("---------------------------------------");
  console.log("Got server's Diffie-Hellman public key:  " + serverDhPubKey);
  console.log("Got server's RSA public key:  " + serverRsaPubKey);

  console.log("Computing shared secret (session) key......");
  const sharedSecret = await computeSharedSecret(serverDhPubKey);

  console.log("Shared key computed: " + sharedSecret);

  const userId = await signUpPDS(
    username,
    password,
    sharedSecret,
    serverRsaPubKey
  );

  await signUpSNE(username, password, verificationKey, userId);

  return {
    serverDhPubKey,
    serverRsaPubKey,
    sharedSecret,
    userId,
  };
};
