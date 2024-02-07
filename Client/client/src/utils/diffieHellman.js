import { createDiffieHellman, getDiffieHellman } from "diffie-hellman/browser";
import { generateSHA256Hash } from "./digest";

const dh = getDiffieHellman("modp14");

export const generateDiffieHellmanKeyPair = () => {
  const diffieHellman = createDiffieHellman(dh.getPrime(), dh.getGenerator());

  diffieHellman.generateKeys();

  const publicKey = diffieHellman.getPublicKey().toString("hex");
  const privateKey = diffieHellman.getPrivateKey().toString("hex");

  return { publicKey, privateKey };
};

export const getDiffieHellmanKeyPair = () => {
  const dhKeyPair = localStorage.getItem("dhKeyPair");
  if (dhKeyPair) {
    const parsedKeyPair = JSON.parse(dhKeyPair);

    return {
      publicKey: parsedKeyPair.publicKey,
      privateKey: parsedKeyPair.privateKey,
    };
  }
  return null;
};

export const computeSharedSecret = async (serverPublicKey) => {
  const dhKeyPair = JSON.parse(localStorage.getItem("dhKeyPair"));

  const diffieHellman = createDiffieHellman(dh.getPrime(), dh.getGenerator());

  diffieHellman.setPrivateKey(Buffer.from(dhKeyPair.privateKey, "hex"));
  diffieHellman.setPublicKey(Buffer.from(dhKeyPair.publicKey, "hex"));

  let shared = diffieHellman.computeSecret(
    Buffer.from(serverPublicKey, "hex"),
    null,
    "hex"
  );

  return await generateSHA256Hash(shared.toString("hex"));
};
